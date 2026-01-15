'use client';

import { useEffect, useState } from 'react';

const statusMessages = [
  'Searching government records',
  'Scanning planning documents',
  'Analyzing public filings',
  'Finding development news',
  'Reviewing community feedback',
  'Compiling intelligence report',
];

interface LoadingStateProps {
  address: string;
}

export default function LoadingState({ address }: LoadingStateProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dots, setDots] = useState('');

  // Cycle through status messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % statusMessages.length);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = Math.min((elapsedTime / 35) * 100, 95); // Cap at 95% until complete

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      {/* Animated orb */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 animate-pulse opacity-20 blur-xl" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 animate-pulse opacity-40 blur-lg" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
          {/* Spinning ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="20 80"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div className="mb-8">
        <p className="text-lg text-gray-900 font-medium h-7">
          {statusMessages[currentMessage]}{dots}
        </p>
        <p className="text-sm text-gray-400 mt-2 truncate max-w-md mx-auto px-4">
          {address}
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-xs mx-auto mb-6">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Time indicator */}
      <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
        <span className="tabular-nums">{elapsedTime}s</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>~30 seconds total</span>
      </div>

      {/* Floating particles */}
      <div className="relative h-16 mt-8 overflow-hidden opacity-40">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
