import Exa from 'exa-js';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const exa = new Exa(apiKey);
    const { address } = await request.json();

    if (!address || address.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a valid address' },
        { status: 400 }
      );
    }

    const research = await exa.research.create({
      instructions: `Research the commercial real estate landscape near ${address}. 

Start with an **Executive Summary** section: Write 2-3 sentences summarizing the key findings, development momentum, and any notable risks or opportunities for this location.

Then structure your detailed findings into these four categories:

### Planning Activity
Find planning board decisions, zoning variances, permit approvals, and municipal meeting minutes. Focus on .gov sources and official city planning documents from the last 2 years. Include specific dates for each finding.

### Community Sentiment  
Find public comments, neighborhood feedback, resident concerns, and any organized opposition to development projects in the area. Note any controversies, denials, or blocked projects. Include dates.

### Development News
Find new construction projects, renovations, proposed developments, and property transactions nearby. Include project values, timelines, and dates when available.

### Tenant Expansion
Find business openings, commercial lease announcements, retailer expansions, and business relocations in the area. Include dates and company names.

For each finding, always include the date (month/year) and source name when available.`,
      model: "exa-research-fast",
    });

    // Stream and collect the final result
    let finalResult = null;
    const stream = await exa.research.get(research.researchId, { stream: true });
    
    for await (const event of stream) {
      finalResult = event;
    }

    // Debug: Log the full response structure
    console.log('=== EXA RESPONSE ===');
    console.log(JSON.stringify(finalResult, null, 2));
    console.log('=== END RESPONSE ===');

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
