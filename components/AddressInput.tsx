'use client';

import { MapPin, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
  isLoading: boolean;
}

export default function AddressInput({
  value,
  onChange,
  onSubmit,
  onTryExample,
  isLoading,
}: AddressInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 123 Main St, Somerville MA"
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white shadow-sm transition-shadow hover:shadow-md"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onTryExample}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 
                     bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          Try Example
        </button>

        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Report
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
