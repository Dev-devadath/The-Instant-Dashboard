# Instant Dashboard Generator

A powerful web application that transforms JSON data into beautiful, functional dashboards using AI. Simply provide your data and a natural language description, and watch as an AI-powered frontend developer creates a stunning dashboard preview instantly.

## Features

- **AI-Powered Generation**: Supports OpenAI GPT-4o and Google Gemini models (for **best results**, use **Gemini 3 Pro (Smartest)**)
- **JSON Data Input**: Easy-to-use JSON editor with validation
- **Natural Language Prompts**: Describe your desired dashboard in plain English
- **Secure Preview**: Sandboxed iframe rendering for safe HTML preview
- **Auto-Save**: Automatically saves your inputs to localStorage
- **Export**: Download generated HTML dashboards
- **Copy to Clipboard**: One-click HTML code copying
- **Modern UI**: Clean, responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key (optional, for OpenAI provider) ([Get one here](https://platform.openai.com/api-keys))
- Google Gemini API key (recommended, for best results with Gemini 3 Pro) ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Dev-devadath/The-Instant-Dashboard.git
cd instant-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_APP_NAME=Instant Dashboard
```

To get the **best results**, make sure `GEMINI_API_KEY` is set and select **Google Gemini → Gemini 3 Pro (Smartest)** in the app's model selector.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.
   3000 had some issues in my end, soo 3001 works.

## Usage

1. **Enter JSON Data**: Paste or type your JSON data in the left panel. Click "Load Example" to try with sample data.

2. **Write a Prompt**: Describe how you want your dashboard to look. For example:
   - "Create a clean business dashboard with a total spending summary at the top and a table below"
   - "Make it modern with blue charts and a dark theme"
   - "Show pie charts for expenses and use a professional font"

3. **Generate**: Click the "Generate Dashboard" button and wait for the AI to create your dashboard.

4. **Preview**: View your generated dashboard in the preview panel on the right.

5. **Export**: Use the download or copy buttons to save your dashboard.

## Example JSON Structure

```json
{
  "report_title": "Monthly Office Spending",
  "currency": "USD",
  "expenses": [
    { "item": "High-speed Internet", "amount": 250 },
    { "item": "Coffee & Snacks", "amount": 400 },
    { "item": "Software Subscriptions", "amount": 1200 },
    { "item": "Office Electricity", "amount": 350 }
  ]
}
```

## User Message:

Create a clean business dashboard. Show a total spending summary at the top and a simple table below for the items. Use a professional font and light grey background.

## Project Structure

```
instant-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main UI page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts     # AI API endpoint (OpenAI & Gemini)
│   ├── components/
│   │   ├── JsonInput.tsx         # JSON editor component
│   │   ├── PromptInput.tsx      # Prompt input component
│   │   ├── GenerateButton.tsx   # Generate button
│   │   ├── PreviewArea.tsx      # Preview iframe component
│   │   └── ErrorDisplay.tsx     # Error display component
│   ├── lib/
│   │   ├── openai.ts            # OpenAI client
│   │   ├── gemini.ts            # Google Gemini client
│   │   ├── systemPrompt.ts      # AI system prompt
│   │   └── validators.ts        # Input validation utilities
│   ├── hooks/
│   │   └── useGenerateDashboard.ts # Custom hook for generation
│   └── types/
│       └── index.ts             # TypeScript types
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env file
└── package.json
```

## Security Features

- **Sandboxed Preview**: Generated HTML is rendered in a sandboxed iframe
- **HTML Sanitization**: Scripts, event handlers, and dangerous elements are removed
- **Rate Limiting**: API requests are rate-limited to prevent abuse
- **Input Validation**: JSON and prompt inputs are validated before processing
- **CSP Headers**: Content Security Policy headers for additional protection

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API and Google Gemini (Gemini 3 Pro recommended)
- **Deployment**: Vercel-ready

## System Prompt

This project uses a carefully crafted **system prompt** (see `src/lib/systemPrompt.ts`) that turns the model into an **expert frontend dashboard developer**.

- **Layout contract**: The prompt enforces a strict HTML structure with a `dashboard` wrapper, header, stats section, and main content area so outputs are consistent and easy to style.
- **Design guidelines**: It bakes in a modern SaaS look (neutral background, rounded cards, subtle shadows, good spacing, strong hierarchy, responsive layout).
- **Safety & correctness**: It requires a full HTML document, inline `<style>` only, **no JavaScript or external libraries**, and instructs the model to only use the provided JSON data (computing totals from that data when needed).

If you want to change how dashboards look or what rules the AI follows, you can **edit the text of `SYSTEM_PROMPT`** in `src/lib/systemPrompt.ts` and redeploy. This prompt is included in the GitHub repo so behavior is transparent and easy to customize.

## Configuration

### Changing the AI Model

You can change the provider and model directly in the UI using the **AI Provider** and **Model** dropdowns at the top of the page.

- **Best quality**: choose **Google Gemini** as the provider and **Gemini 3 Pro (Smartest)** as the model.
- **Faster/cheaper**: choose **OpenAI** with a lighter model such as `gpt-40-mini`.

If you want to change the default models programmatically, edit `src/components/ModelSelector.tsx`. By default it uses:

```typescript
// Default when switching providers
if (newProvider === "openai") {
  onModelChange("gpt-4o");
} else {
  onModelChange("gemini-3-pro-preview"); // Gemini 3 Pro (Smartest)
}
```

### Adjusting Rate Limits

Edit the rate limit constants in `src/app/api/generate/route.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // Time window in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per window
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

## Limitations

- Generated dashboards are HTML/CSS only (no JavaScript)
- Maximum JSON size: 50KB
- Maximum prompt length: 2000 characters
- Rate limit: 10 requests per minute per IP

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
