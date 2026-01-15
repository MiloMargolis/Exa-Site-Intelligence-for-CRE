'use client';

import { useEffect, useState } from 'react';
import { Search, Users, Newspaper, Store, Check } from 'lucide-react';

const steps = [
  { icon: Search, label: 'Searching planning records...', duration: 8000 },
  { icon: Users, label: 'Analyzing community sentiment...', duration: 10000 },
  { icon: Newspaper, label: 'Finding development news...', duration: 10000 },
  { icon: Store, label: 'Compiling report...', duration: 12000 },
];

interface LoadingStateProps {
  address: string;
}

export default function LoadingState({ address }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let totalTime = 0;
    const timeouts: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      if (index > 0) {
        const timeout = setTimeout(() => {
          setCurrentStep(index);
        }, totalTime);
        timeouts.push(timeout);
      }
      totalTime += step.duration;
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Address being searched */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500">Researching</p>
        <p className="text-lg font-medium text-gray-900 mt-1">{address}</p>
      </div>

      {/* Progress steps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 border border-blue-100'
                    : isComplete
                    ? 'bg-gray-50'
                    : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive
                      ? 'text-blue-700'
                      : isComplete
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time elapsed */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Time elapsed: <span className="font-medium">{formatTime(elapsedTime)}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Research typically takes 25-40 seconds
          </p>
        </div>
      </div>

      {/* Skeleton cards preview */}
      <div className="mt-6 grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100" />
              <div className="h-5 w-32 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
