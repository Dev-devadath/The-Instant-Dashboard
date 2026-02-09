# Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file:**
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Using GPT-5.1

When GPT-5.1 becomes available, update the model in `src/app/api/generate/route.ts`:

```typescript
model: 'gpt-5.1', // Change from 'gpt-4o' to 'gpt-5.1'
```

Or make it configurable via environment variable by adding to `.env.local`:
```env
OPENAI_MODEL=gpt-5.1
```

And updating the route to:
```typescript
model: process.env.OPENAI_MODEL || 'gpt-4o',
```

## First Dashboard

1. Click "Load Example" in the JSON input area
2. Enter a prompt like: "Create a clean business dashboard with a total spending summary at the top and a table below"
3. Click "Generate Dashboard"
4. Wait a few seconds for the AI to create your dashboard
5. View the preview and download if you like it!

## Troubleshooting

- **"Invalid OpenAI API key"**: Make sure your `.env.local` file has the correct API key
- **Rate limit errors**: Wait a minute and try again (10 requests per minute limit)
- **No preview**: Check that your JSON is valid and your prompt is not empty
