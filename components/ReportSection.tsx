'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  content: string | string[] | null | undefined;
  sources?: Array<{ url: string; title?: string }>;
  isLoading?: boolean;
  defaultExpanded?: boolean;
}

export default function ReportSection({
  title,
  icon: Icon,
  content,
  sources = [],
  isLoading = false,
  defaultExpanded = true,
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Parse content into array of items
  const parseContent = (content: string | string[] | null | undefined): string[] => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    
    // Split by newlines or bullet points
    const items = content
      .split(/\n|•|·|-(?=\s)/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return items.length > 0 ? items : [content];
  };

  const items = parseContent(content);
  const hasContent = items.length > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {!hasContent && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              No results
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {hasContent ? (
            <ul className="mt-4 space-y-3">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500 text-sm">
              No relevant information found for this category. Try a different location or expand the search area.
            </p>
          )}

          {sources.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 
                               bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    {source.title || new URL(source.url).hostname}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
