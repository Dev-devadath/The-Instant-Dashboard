# Instant Dashboard Generator

A powerful web application that transforms JSON data into beautiful, functional dashboards using AI. Simply provide your data and a natural language description, and watch as an AI-powered frontend developer creates a stunning dashboard preview instantly.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI GPT-4o to generate professional dashboards
- 📊 **JSON Data Input**: Easy-to-use JSON editor with validation
- 💬 **Natural Language Prompts**: Describe your desired dashboard in plain English
- 🔒 **Secure Preview**: Sandboxed iframe rendering for safe HTML preview
- 💾 **Auto-Save**: Automatically saves your inputs to localStorage
- 📥 **Export**: Download generated HTML dashboards
- 📋 **Copy to Clipboard**: One-click HTML code copying
- 🎨 **Modern UI**: Clean, responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd instant-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_APP_NAME=Instant Dashboard
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
    {"item": "High-speed Internet", "amount": 250},
    {"item": "Coffee & Snacks", "amount": 400},
    {"item": "Software Subscriptions", "amount": 1200},
    {"item": "Office Electricity", "amount": 350}
  ]
}
```

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
│   │           └── route.ts     # OpenAI API endpoint
│   ├── components/
│   │   ├── JsonInput.tsx         # JSON editor component
│   │   ├── PromptInput.tsx      # Prompt input component
│   │   ├── GenerateButton.tsx   # Generate button
│   │   ├── PreviewArea.tsx      # Preview iframe component
│   │   └── ErrorDisplay.tsx     # Error display component
│   ├── lib/
│   │   ├── openai.ts            # OpenAI client
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
- **AI**: OpenAI GPT-4o API
- **Deployment**: Vercel-ready

## Configuration

### Changing the AI Model

To use a different OpenAI model (e.g., GPT-5.1 when available), edit `src/app/api/generate/route.ts`:

```typescript
model: 'gpt-5.1', // or 'gpt-4o', 'gpt-4-turbo', etc.
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
