import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { genAI } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import {
  validateJson,
  validatePrompt,
  sanitizeHtml,
  extractHtmlFromResponse,
} from "@/lib/validators";
import { ModelProvider } from "@/types";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 },
      );
    }

    // Check content length
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 100000) {
      return NextResponse.json(
        { error: "Request payload too large. Maximum size is 100KB." },
        { status: 413 },
      );
    }

    const body = await request.json();
    const { jsonData, userPrompt, provider = 'openai', model = 'gpt-4o' } = body;

    // Validate inputs exist
    if (!jsonData) {
      return NextResponse.json(
        { error: "JSON data is required" },
        { status: 400 },
      );
    }

    if (!userPrompt || typeof userPrompt !== "string") {
      return NextResponse.json(
        { error: "User prompt is required" },
        { status: 400 },
      );
    }

    // Validate JSON structure
    if (
      typeof jsonData !== "object" ||
      (Array.isArray(jsonData) === false && jsonData === null)
    ) {
      return NextResponse.json(
        { error: "Invalid JSON data provided. Must be a valid JSON object." },
        { status: 400 },
      );
    }

    // Check JSON size (stringified)
    const jsonString = JSON.stringify(jsonData);
    if (jsonString.length > 50000) {
      return NextResponse.json(
        { error: "JSON data too large. Maximum size is 50KB." },
        { status: 400 },
      );
    }

    const promptValidation = validatePrompt(userPrompt);
    if (!promptValidation.valid) {
      return NextResponse.json(
        { error: promptValidation.error },
        { status: 400 },
      );
    }

    // Construct the user message
    const userMessage = `Data: ${JSON.stringify(jsonData, null, 2)}\n\nInstructions: ${userPrompt}`;
    
    let responseContent: string | null = null;

    if (provider === 'openai') {
        const completion = await openai.chat.completions.create(
          {
            model: model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          },
          {
            timeout: 30000, // 30 second timeout
          },
        );
        responseContent = completion.choices[0]?.message?.content;
    } else if (provider === 'gemini') {
        if (!process.env.GEMINI_API_KEY) {
             return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 },
              );
        }
        
        const geminiModel = genAI.getGenerativeModel({ 
            model: model,
            systemInstruction: SYSTEM_PROMPT 
        });
        
        const result = await geminiModel.generateContent(userMessage);
        
        const response = await result.response;
        responseContent = response.text();
    } else {
        return NextResponse.json(
            { error: "Invalid provider specified" },
            { status: 400 }
        );
    }


    if (!responseContent) {
      return NextResponse.json(
        { error: "No response generated from AI" },
        { status: 500 },
      );
    }

    // Extract and sanitize HTML
    let html = extractHtmlFromResponse(responseContent);
    html = sanitizeHtml(html);

    // Basic validation - ensure it's HTML
    if (!html.includes("<html") && !html.includes("<!DOCTYPE")) {
      return NextResponse.json(
        { error: "Generated content is not valid HTML" },
        { status: 500 },
      );
    }

    return NextResponse.json({ html });
  } catch (error: unknown) {
    console.error("Error generating dashboard:", error);

    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (
        error.message.includes("401") ||
        error.message.includes("Invalid API key")
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid API key. Please check your environment variables.",
          },
          { status: 401 },
        );
      }

      if (
        error.message.includes("429") ||
        error.message.includes("rate limit")
      ) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 },
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 504 },
        );
      }

      return NextResponse.json(
        {
          error:
            error.message || "An error occurred while generating the dashboard",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
