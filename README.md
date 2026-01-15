# CRE Site Intelligence

An AI-powered site intelligence app for commercial real estate developers. Enter a property address and get a comprehensive report on planning activity, community sentiment, development news, and tenant expansion nearby.

**Live Demo:** [exa-site-intelligence-for-cre.vercel.app](https://exa-site-intelligence-for-cre.vercel.app)

## Features

### Research Categories
- **Planning Activity** — Zoning decisions, permit approvals, planning board meetings, and municipal records
- **Community Sentiment** — Public comments, neighborhood feedback, resident concerns, and opposition tracking
- **Development News** — New construction, renovations, proposed developments, and property transactions
- **Tenant Expansion** — Business openings, commercial lease announcements, and retailer expansions

### Intelligence Features
- **Executive Summary** — AI-generated 2-3 sentence overview of key findings
- **Entitlement Risk Indicator** — Color-coded risk assessment (Low/Moderate/High) based on community opposition signals
- **Date Badges** — Extracted dates displayed on each finding for recency context
- **Source Attribution** — Clickable source links and total source count for credibility

### UX Features
- **Address Autocomplete** — Google Places integration for verified US addresses
- **Progressive Loading** — Category cards fill in as research completes
- **Live Source Feed** — Real-time display of sources being searched

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Research API**: Exa Research (`exa-research-fast`)
- **Address Autocomplete**: Google Places API
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Exa API key](https://dashboard.exa.ai)
- [Google Maps API key](https://console.cloud.google.com) (with Places API enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cre-site-intelligence.git
cd cre-site-intelligence

# Install dependencies
npm install

# Create environment file
touch .env.local
```

Add your API keys to `.env.local`:

```env
EXA_API_KEY=your_exa_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. Enter a property address or click **"Try an example"**
2. Select a verified address from the autocomplete dropdown
3. Wait ~30-60 seconds while Exa researches government records, news, and public filings
4. Review the structured intelligence report with:
   - Executive summary
   - Risk assessment
   - Detailed findings across 4 categories
   - Source links for verification

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `EXA_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
4. Deploy

### Google API Configuration

For the address autocomplete to work on your deployed site:

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your API key restrictions
3. Add your Vercel URL to the allowed websites:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/*`

## Project Structure

```
/app
  /page.tsx              — Main UI with address input + results
  /api/research/route.ts — Server-side Exa Research API
  /layout.tsx            — Root layout with fonts
  /globals.css           — Global styles + Google Places styling
/components
  /AddressInput.tsx      — Input with Google Places autocomplete
  /ReportSection.tsx     — Collapsible category cards with findings
  /LoadingState.tsx      — Progressive loading experience
  /ErrorState.tsx        — Error handling display
```

## How It Works

1. User enters a property address
2. Frontend sends address to `/api/research`
3. Server calls Exa's Research API with structured instructions
4. Exa searches government records, news archives, and public filings
5. Response is parsed into categories and displayed with:
   - Risk signals extracted from keywords
   - Dates extracted from text
   - Sources linked for verification

## Demo Addresses

The app works well with addresses in major US metros. Try:
- `675 W Kendall St, Cambridge, MA` (biotech corridor)
- `255 Elm St, Somerville, MA` (urban development)
- `100 Summer St, Boston, MA` (downtown commercial)

---

Built with [Exa](https://exa.ai) — Search built for AI
