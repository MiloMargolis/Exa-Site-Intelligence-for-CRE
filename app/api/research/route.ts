import Exa from 'exa-js';
import { NextRequest } from 'next/server';

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || address.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a valid address' },
        { status: 400 }
      );
    }

    const research = await exa.research({
      query: `Planning board decisions and development activity near ${address}`,
      instructions: `Focus on official government sources like .gov sites and municipal meeting minutes. Include PDF documents from city planning departments and zoning boards. Also search local news coverage for community sentiment and development announcements. Prioritize recent activity from the last 2 years.`,
      model: "exa-research-fast",
      outputSchema: {
        planning_activity: "List of planning board decisions, zoning variances, and permit approvals with dates, outcomes, and brief descriptions",
        community_sentiment: "Public comments, neighborhood feedback, resident concerns, and any organized opposition to development projects",
        development_news: "New construction projects, renovations, proposed developments, and property transactions nearby",
        tenant_expansion: "Business openings, commercial lease announcements, retailer expansions, and relocations in the area"
      }
    });

    return Response.json(research);
  } catch (error) {
    console.error('Research API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return Response.json(
          { error: 'Research is taking longer than expected. Please try again.' },
          { status: 504 }
        );
      }
    }
    
    return Response.json(
      { error: 'An error occurred while generating the report. Please try again.' },
      { status: 500 }
    );
  }
}
