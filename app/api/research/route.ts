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

    const research = await exa.research.create({
      instructions: `Research the commercial real estate landscape near ${address}. Structure your findings into these four categories:

**Planning Activity**: Find planning board decisions, zoning variances, permit approvals, and municipal meeting minutes. Focus on .gov sources and official city planning documents from the last 2 years.

**Community Sentiment**: Find public comments, neighborhood feedback, resident concerns, and any organized opposition to development projects in the area.

**Development News**: Find new construction projects, renovations, proposed developments, and property transactions nearby.

**Tenant Expansion**: Find business openings, commercial lease announcements, retailer expansions, and business relocations in the area.

For each finding, include the date and source when available.`,
      model: "exa-research-fast",
    });

    // Stream and collect the final result
    let finalResult = null;
    const stream = await exa.research.get(research.researchId, { stream: true });
    
    for await (const event of stream) {
      finalResult = event;
    }

    return Response.json({ 
      data: finalResult,
      researchId: research.researchId 
    });
  } catch (error) {
    console.error('Research API error:', error);
    
    return Response.json(
      { error: 'An error occurred while generating the report. Please try again.' },
      { status: 500 }
    );
  }
}
