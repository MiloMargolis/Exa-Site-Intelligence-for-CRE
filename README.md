# CRE Site Intelligence

An AI-powered site intelligence app for commercial real estate developers. Enter a property address and get a comprehensive report on planning activity, community sentiment, development news, and tenant expansion nearby.

## Features

- **Planning Activity** — Zoning decisions, permit approvals, and planning board meetings
- **Community Sentiment** — Public comments, neighborhood feedback, and resident concerns
- **Development News** — New construction, renovations, and property transactions
- **Tenant Expansion** — Business openings, lease announcements, and relocations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **API**: Exa Research (exa-research-fast)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Exa API key ([Get one here](https://exa.ai))

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Add your EXA_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```
EXA_API_KEY=your_exa_api_key_here
```

## Usage

1. Enter a property address (e.g., "255 Elm St, Somerville MA")
2. Click "Generate Report" or use the "Try Example" button
3. Wait 25-40 seconds for the AI to research and compile the report
4. Review the structured intelligence across 4 categories

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cre-site-intelligence)

Remember to add your `EXA_API_KEY` environment variable in Vercel's project settings.

## Demo

The app works best with addresses in Massachusetts (Somerville, Boston, Cambridge) for the demo, as these areas have rich public records and local news coverage.
