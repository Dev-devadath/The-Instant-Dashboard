export function validateJson(jsonString: string): { valid: boolean; error?: string; data?: unknown } {
  if (!jsonString || jsonString.trim().length === 0) {
    return { valid: false, error: 'JSON input cannot be empty' };
  }

  try {
    const data = JSON.parse(jsonString);
    return { valid: true, data };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format',
    };
  }
}

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }

  if (prompt.length > 2000) {
    return { valid: false, error: 'Prompt must be less than 2000 characters' };
  }

  return { valid: true };
}

export function sanitizeHtml(html: string): string {
  let sanitized = html;
  
  // Remove any script tags and their content (including nested tags)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any style tags with javascript (rare but possible)
  sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    if (match.toLowerCase().includes('javascript:')) {
      return '';
    }
    return match;
  });
  
  // Remove any event handlers (onclick, onload, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol in href, src, etc.
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: URLs that might contain scripts (keep data: for images)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  sanitized = sanitized.replace(/data:application\/javascript/gi, '');
  
  // Remove iframe tags (security risk)
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object and embed tags (can execute code)
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  
  return sanitized;
}

export function extractHtmlFromResponse(response: string): string {
  // Remove markdown code blocks if present
  let html = response.trim();
  
  // Remove ```html or ``` at start/end
  html = html.replace(/^```html\s*/i, '');
  html = html.replace(/^```\s*/, '');
  html = html.replace(/\s*```$/g, '');
  
  // Trim again after removing code blocks
  html = html.trim();
  
  // If it doesn't start with <!DOCTYPE or <html, try to extract HTML from the response
  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    // Try to find HTML content between tags
    const htmlMatch = html.match(/<html[\s\S]*<\/html>/i);
    if (htmlMatch) {
      html = htmlMatch[0];
    }
  }
  
  return html;
}
