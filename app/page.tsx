'use client';

import { useState } from 'react';
import { Building2, Users, Newspaper, Store, Clock, RotateCcw } from 'lucide-react';
import AddressInput from '@/components/AddressInput';
import ReportSection from '@/components/ReportSection';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

const EXAMPLE_ADDRESS = '255 Elm St, Somerville MA';

interface ResearchResult {
  data?: {
    planning_activity?: string;
    community_sentiment?: string;
    development_news?: string;
    tenant_expansion?: string;
  };
  costDollars?: {
    total: number;
  };
}

type AppState = 'input' | 'loading' | 'results' | 'error';

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Site Intelligence</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Powered by Exa
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Input State */}
        {appState === 'input' && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Site Intelligence Report
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Enter a property address to get an AI-powered analysis of planning activity, 
              community sentiment, and development news nearby.
            </p>
            <AddressInput
              value={address}
              onChange={setAddress}
              onSubmit={handleSubmit}
              onTryExample={handleTryExample}
              isLoading={false}
            />
            
            {/* Features */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Building2, label: 'Planning Activity' },
                { icon: Users, label: 'Community Sentiment' },
                { icon: Newspaper, label: 'Development News' },
                { icon: Store, label: 'Tenant Expansion' },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">{feature.label}</span>
                </div>
              ))}
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
          <div>
            {/* Results Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Intelligence Report
              </h2>
              <p className="text-gray-600">{address}</p>
            </div>

            {/* Report Sections */}
            <div className="space-y-4 mb-10">
              <ReportSection
                title="Planning Activity"
                icon={Building2}
                content={result.data?.planning_activity}
                defaultExpanded={true}
              />
              <ReportSection
                title="Community Sentiment"
                icon={Users}
                content={result.data?.community_sentiment}
                defaultExpanded={true}
              />
              <ReportSection
                title="Development News"
                icon={Newspaper}
                content={result.data?.development_news}
                defaultExpanded={true}
              />
              <ReportSection
                title="Tenant Expansion"
                icon={Store}
                content={result.data?.tenant_expansion}
                defaultExpanded={true}
              />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                <Clock className="w-5 h-5" />
                <span className="text-sm">
                  This report would typically take <strong>4-6 hours</strong> of manual research
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
                           text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Search Another Address
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
