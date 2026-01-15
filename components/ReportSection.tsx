'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  content: string | string[] | null | undefined;
  isLoading?: boolean;
  defaultExpanded?: boolean;
}

// Risk keywords to flag
const RISK_KEYWORDS = [
  'opposition', 'opposed', 'denied', 'rejected', 'concerns', 
  'controversy', 'blocked', 'protest', 'lawsuit', 'appeal',
  'delayed', 'contested', 'dispute', 'residents oppose'
];

// Parse markdown content and extract sources
function parseMarkdownContent(content: string): {
  text: string;
  sources: Array<{ title: string; url: string }>;
} {
  const sources: Array<{ title: string; url: string }> = [];
  
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const [, title, url] = match;
    if (!sources.some(s => s.url === url)) {
      sources.push({ title, url });
    }
  }
  
  let cleanText = content
    .replace(/\s*\(\[([^\]]+)\]\([^)]+\)\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  
  return { text: cleanText, sources };
}

// Extract date from text
function extractDate(text: string): string | null {
  // Match patterns like "December 2025", "Dec 2025", "12/2025", "2025", "May 2024"
  const patterns = [
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i,
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{4})\b/i,
    /\b(\d{1,2})\/(\d{4})\b/,
    /\b(Q[1-4])\s+(\d{4})\b/i,
    /\b(early|mid|late)\s+(\d{4})\b/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern === patterns[2]) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(match[1]) - 1]} ${match[2]}`;
      }
      return `${match[1]} ${match[2]}`;
    }
  }
  
  // Just year
  const yearMatch = text.match(/\b(202[0-9])\b/);
  if (yearMatch) return yearMatch[1];
  
  return null;
}

// Check if text contains risk keywords
function hasRiskSignal(text: string): boolean {
  const lowerText = text.toLowerCase();
  return RISK_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Split text into sentences
function splitIntoPoints(text: string): string[] {
  const sentences = text
    .split(/(?<=\.)\s+(?=[A-Z])|(?<=\.)(?=\s*$)/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
  
  return sentences;
}

export default function ReportSection({
  title,
  icon: Icon,
  content,
  isLoading = false,
  defaultExpanded = true,
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const processedContent = typeof content === 'string' ? parseMarkdownContent(content) : null;
  const points = processedContent ? splitIntoPoints(processedContent.text) : [];
  const sources = processedContent?.sources || [];
  const hasContent = points.length > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-50 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-50 rounded animate-pulse w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon className="w-[18px] h-[18px] text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {hasContent && (
            <span className="text-xs text-gray-400">
              {points.length} {points.length === 1 ? 'finding' : 'findings'}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          {hasContent ? (
            <>
              <div className="space-y-4">
                {points.map((point, index) => {
                  const date = extractDate(point);
                  
                  return (
                    <div 
                      key={index} 
                      className="pl-4 border-l-2 border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <p className="text-[15px] leading-relaxed text-gray-600">
                        {point}
                      </p>
                      {date && (
                        <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {date}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {sources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {sources.slice(0, 5).map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 
                                   bg-gray-50 px-2.5 py-1.5 rounded-md hover:bg-gray-100 
                                   hover:text-gray-700 transition-colors"
                      >
                        {source.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                    {sources.length > 5 && (
                      <span className="text-xs text-gray-400 px-2 py-1.5">
                        +{sources.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 pl-4 border-l-2 border-gray-100">
              No relevant information found for this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Export helper for use in parent component
export { parseMarkdownContent, extractDate, hasRiskSignal, RISK_KEYWORDS };
