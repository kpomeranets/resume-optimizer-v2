# Resume Optimizer V2

AI-powered resume optimization application built with Next.js 14+ and Anthropic Claude.

## Features

- 📄 Upload resume (PDF, DOCX, TXT)
- 🔍 AI-powered keyword gap analysis
- 💬 Authenticity wizard for clarification
- ✨ STAR-method bullet rewriting
- 📥 Export optimized resume to DOCX

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **AI**: Anthropic Claude (Claude 3.5 Sonnet)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animation**: Framer Motion

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
