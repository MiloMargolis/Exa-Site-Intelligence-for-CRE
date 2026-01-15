'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, Newspaper, Store, Check } from 'lucide-react';

const steps = [
  { 
    label: 'Searching government records...', 
    icon: Building2,
    category: 'Planning Activity',
    sources: ['Boston.gov', 'Mass.gov', 'City Planning Portal', 'Zoning Board Records']
  },
  { 
    label: 'Scanning planning board minutes...', 
    icon: Building2,
    category: 'Planning Activity',
    sources: ['Planning Board Minutes', 'Municipal Archives', 'Permit Database', 'Council Records']
  },
  { 
    label: 'Analyzing community sentiment...', 
    icon: Users,
    category: 'Community Sentiment',
    sources: ['Public Comments', 'Neighborhood Forums', 'Local News', 'Community Boards']
  },
  { 
    label: 'Finding development news...', 
    icon: Newspaper,
    category: 'Development News',
    sources: ['Business Journal', 'Real Estate News', 'Construction Updates', 'Property Records']
  },
  { 
    label: 'Checking tenant activity...', 
    icon: Store,
    category: 'Tenant Expansion',
    sources: ['Commercial Listings', 'Lease Announcements', 'Business Filings', 'Retail News']
  },
  { 
    label: 'Compiling your report...', 
    icon: Check,
    category: null,
    sources: ['Synthesizing findings', 'Generating summary', 'Calculating risk signals']
  },
];

const categories = [
  { name: 'Planning Activity', icon: Building2 },
  { name: 'Community Sentiment', icon: Users },
  { name: 'Development News', icon: Newspaper },
  { name: 'Tenant Expansion', icon: Store },
];

interface LoadingStateProps {
  address: string;
}

export default function LoadingState({ address }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSource, setCurrentSource] = useState(0);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate through steps every 5 seconds
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = Math.min(prev + 1, steps.length - 1);
        // Mark category as complete when moving past it
        const currentCategory = steps[prev].category;
        if (currentCategory && !completedCategories.includes(currentCategory)) {
          setCompletedCategories(c => [...c, currentCategory]);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(stepInterval);
  }, [completedCategories]);

  // Cycle through sources rapidly
  useEffect(() => {
    const sourceInterval = setInterval(() => {
      setCurrentSource((prev) => (prev + 1) % steps[currentStep].sources.length);
    }, 600);
    return () => clearInterval(sourceInterval);
  }, [currentStep]);

  // Progress moves in chunks based on step
  const progress = Math.min(((currentStep + 1) / steps.length) * 100, 95);
  
  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-gray-900 mb-2">
          Researching
        </h2>
        <p className="text-gray-500 truncate max-w-md mx-auto">{address}</p>
      </div>

      {/* Current step indicator */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
          <CurrentIcon className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">
            {steps[currentStep].label}
          </span>
        </div>
      </div>

      {/* Progress bar - moves in chunks */}
      <div className="max-w-md mx-auto mb-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live source feed */}
      <div className="text-center mb-8 h-6">
        <p className="text-xs text-gray-400">
          <span className="text-gray-500">{steps[currentStep].sources[currentSource]}</span>
          <span className="mx-2">→</span>
          <span className="text-gray-400">
            {steps[currentStep].sources[(currentSource + 1) % steps[currentStep].sources.length]}
          </span>
          <span className="mx-2">→</span>
          <span className="text-gray-300">
            {steps[currentStep].sources[(currentSource + 2) % steps[currentStep].sources.length]}
          </span>
        </p>
      </div>

      {/* Category cards */}
      <div className="space-y-3">
        {categories.map((category, index) => {
          const isComplete = completedCategories.includes(category.name);
          const isActive = steps[currentStep].category === category.name;
          const Icon = category.icon;

          return (
            <div
              key={category.name}
              className={`p-4 rounded-xl border transition-all duration-500 ${
                isComplete
                  ? 'bg-white border-green-200'
                  : isActive
                  ? 'bg-white border-blue-200'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isComplete
                    ? 'bg-green-100'
                    : isActive
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {isComplete ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${
                    isComplete ? 'text-gray-900' : isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {category.name}
                  </span>
                </div>
                {isComplete && (
                  <span className="text-xs text-green-600 font-medium">Complete</span>
                )}
                {isActive && (
                  <span className="text-xs text-blue-600 font-medium animate-pulse">Searching...</span>
                )}
              </div>
              
              {/* Skeleton content for incomplete cards */}
              {!isComplete && (
                <div className="mt-3 space-y-2">
                  <div className={`h-3 rounded ${isActive ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'}`} 
                       style={{ width: isActive ? '80%' : '60%' }} />
                  <div className={`h-3 rounded ${isActive ? 'bg-blue-50 animate-pulse' : 'bg-gray-50'}`} 
                       style={{ width: isActive ? '60%' : '40%' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <svg 
          className="w-4 h-4 text-gray-400 animate-spin" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <circle 
            className="opacity-25" 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="3"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="text-sm text-gray-400 tabular-nums">{elapsedTime}s elapsed</span>
      </div>
    </div>
  );
}
