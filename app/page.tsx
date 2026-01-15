'use client';

import { useState, useMemo } from 'react';
import { Building2, Users, Newspaper, Store, Clock, RotateCcw, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import AddressInput from '@/components/AddressInput';
import ReportSection, { RISK_KEYWORDS } from '@/components/ReportSection';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

const EXAMPLE_ADDRESS = '255 Elm St, Somerville MA';

interface ResearchResult {
  data?: string | { 
    output?: { 
      content?: string;
      costDollars?: { total: number; numSearches?: number; numPages?: number };
    }; 
    content?: string; 
  };
  researchId?: string;
}

type AppState = 'input' | 'loading' | 'results' | 'error';

type RiskLevel = 'low' | 'moderate' | 'high';

// Parse markdown response into sections
function parseMarkdownSections(markdown: string): { 
  sections: Record<string, string>;
  summary: string;
} {
  const sections: Record<string, string> = {
    planning_activity: '',
    community_sentiment: '',
    development_news: '',
    tenant_expansion: '',
  };

  // Extract executive summary - look for ## or ### Executive Summary section
  const summaryMatch = markdown.match(/#{2,3}\s*Executive Summary\s*\n([\s\S]*?)(?=#{2,3}\s*(?:Planning Activity|Community Sentiment|Development News|Tenant Expansion)|$)/i);
  let summary = '';
  if (summaryMatch) {
    summary = summaryMatch[1].trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/\s+/g, ' ');
  }

  // Match ## or ### headers (Exa uses h2 or h3 markdown headers)
  const headerPattern = (name: string, others: string[]) => {
    const otherPattern = others.join('|');
    return new RegExp(`#{2,3}\\s*${name}\\s*\\n([\\s\\S]*?)(?=#{2,3}\\s*(?:${otherPattern}|Sources)|$)`, 'i');
  };

  const planningMatch = markdown.match(headerPattern('Planning Activity', ['Community Sentiment', 'Development News', 'Tenant Expansion']));
  const communityMatch = markdown.match(headerPattern('Community Sentiment', ['Planning Activity', 'Development News', 'Tenant Expansion']));
  const developmentMatch = markdown.match(headerPattern('Development News', ['Planning Activity', 'Community Sentiment', 'Tenant Expansion']));
  const tenantMatch = markdown.match(headerPattern('Tenant Expansion', ['Planning Activity', 'Community Sentiment', 'Development News']));

  if (planningMatch) sections.planning_activity = planningMatch[1].trim();
  if (communityMatch) sections.community_sentiment = communityMatch[1].trim();
  if (developmentMatch) sections.development_news = developmentMatch[1].trim();
  if (tenantMatch) sections.tenant_expansion = tenantMatch[1].trim();

  return { sections, summary };
}

// Calculate entitlement risk level
function calculateRiskLevel(communitySentiment: string): RiskLevel {
  const lowerContent = communitySentiment.toLowerCase();
  
  const highRiskKeywords = ['denied', 'rejected', 'blocked', 'lawsuit', 'litigation'];
  const moderateRiskKeywords = ['opposition', 'opposed', 'concerns', 'controversy', 'protest', 'appeal', 'contested'];
  
  const hasHighRisk = highRiskKeywords.some(k => lowerContent.includes(k));
  const moderateCount = moderateRiskKeywords.filter(k => lowerContent.includes(k)).length;
  
  if (hasHighRisk) return 'high';
  if (moderateCount >= 2) return 'high';
  if (moderateCount >= 1) return 'moderate';
  
  return 'low';
}

// Extract unique sources from markdown
function extractSources(markdown: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const sources = new Set<string>();
  let match;
  
  while ((match = linkRegex.exec(markdown)) !== null) {
    sources.add(match[1]);
  }
  
  return Array.from(sources);
}

// Results view component
function ResultsView({ 
  result, 
  address, 
  onReset 
}: { 
  result: ResearchResult; 
  address: string; 
  onReset: () => void;
}) {
  const { sections, summary, riskLevel, sources, stats } = useMemo(() => {
    let markdown = '';
    if (typeof result.data === 'string') {
      markdown = result.data;
    } else if (result.data?.output?.content) {
      markdown = result.data.output.content;
    } else if (result.data?.content) {
      markdown = result.data.content;
    }
    
    const { sections, summary } = parseMarkdownSections(markdown);
    const riskLevel = calculateRiskLevel(sections.community_sentiment);
    const sources = extractSources(markdown);
    
    // Get stats from Exa response
    const costData = typeof result.data !== 'string' ? result.data?.output?.costDollars : null;
    const stats = {
      numSearches: costData?.numSearches || sources.length,
      numPages: Math.round(costData?.numPages || sources.length * 1.5),
    };
    
    return { sections, summary, riskLevel, sources, stats };
  }, [result]);

  const riskConfig = {
    low: { 
      label: 'Low Risk', 
      color: 'text-green-700', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      icon: CheckCircle 
    },
    moderate: { 
      label: 'Moderate Risk', 
      color: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200',
      icon: AlertTriangle 
    },
    high: { 
      label: 'High Risk', 
      color: 'text-red-700', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      icon: AlertTriangle 
    },
  };

  const risk = riskConfig[riskLevel];
  const RiskIcon = risk.icon;

  return (
    <div>
      {/* Results Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
          Intelligence Report
        </h2>
        <p className="text-gray-500">{address}</p>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-[18px] h-[18px] text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Executive Summary</h3>
              <p className="text-[15px] leading-relaxed text-gray-700">{summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Entitlement Risk Indicator */}
      <div className={`mb-6 p-4 rounded-xl border ${risk.bg} ${risk.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiskIcon className={`w-5 h-5 ${risk.color}`} />
            <div>
              <span className="text-sm text-gray-600">Entitlement Environment:</span>
              <span className={`ml-2 font-semibold ${risk.color}`}>{risk.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Shield className={`w-4 h-4 ${risk.color}`} />
          </div>
        </div>
        {riskLevel !== 'low' && (
          <p className="mt-2 text-sm text-gray-600 pl-8">
            {riskLevel === 'high' 
              ? 'Active opposition or project denials detected. Due diligence recommended.'
              : 'Some community concerns noted. Monitor local sentiment.'}
          </p>
        )}
      </div>

      {/* Report Sections */}
      <div className="space-y-4 mb-8">
        <ReportSection
          title="Planning Activity"
          icon={Building2}
          content={sections.planning_activity}
          defaultExpanded={true}
        />
        <ReportSection
          title="Community Sentiment"
          icon={Users}
          content={sections.community_sentiment}
          defaultExpanded={true}
        />
        <ReportSection
          title="Development News"
          icon={Newspaper}
          content={sections.development_news}
          defaultExpanded={true}
        />
        <ReportSection
          title="Tenant Expansion"
          icon={Store}
          content={sections.tenant_expansion}
          defaultExpanded={true}
        />
      </div>

      {/* Footer */}
      <div className="rounded-xl p-6 text-center border border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            This report would typically take <strong className="text-gray-800">4-6 hours</strong> of manual research
          </span>
        </div>
        
        {/* Sources searched */}
        <p className="text-xs text-gray-400 mb-4">
          Exa searched <strong className="text-gray-500">{stats.numSearches}</strong> sources including{' '}
          {sources.slice(0, 3).join(', ')}
          {sources.length > 3 && `, and ${sources.length - 3} more`}
        </p>
        
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
                     text-blue-600 hover:text-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Search Another Address
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [appState, setAppState] = useState<AppState>('input');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!address.trim()) return;
    
    setAppState('loading');
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setResult(data);
      setAppState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('error');
    }
  };

  const handleTryExample = () => {
    setAddress(EXAMPLE_ADDRESS);
  };

  const handleReset = () => {
    setAddress('');
    setAppState('input');
    setResult(null);
    setError('');
  };

  const handleRetry = () => {
    handleSubmit();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-medium text-gray-900">Take Home Exercise - Milo Margolis</span>
          <span className="text-xs text-gray-400">
            Powered by Exa
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        {/* Input State */}
        {appState === 'input' && (
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-12">
              CRE Site Intelligence
            </h1>
            <AddressInput
              value={address}
              onChange={setAddress}
              onSubmit={handleSubmit}
              onTryExample={handleTryExample}
              isLoading={false}
            />
            
            {/* Category preview */}
            <div className="mt-16 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Planning</span>
              </div>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Sentiment</span>
              </div>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                <span>Development</span>
              </div>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>Tenants</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {appState === 'loading' && <LoadingState address={address} />}

        {/* Error State */}
        {appState === 'error' && (
          <ErrorState
            message={error}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        )}

        {/* Results State */}
        {appState === 'results' && result && (
          <ResultsView result={result} address={address} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
