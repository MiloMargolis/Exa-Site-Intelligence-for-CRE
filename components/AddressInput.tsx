'use client';

import { ArrowUp, Loader2 } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search any address..."
          className="w-full px-5 pr-14 py-4 text-lg border border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                     bg-white shadow-sm transition-all duration-200
                     placeholder:text-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                     bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl 
                     hover:from-blue-600 hover:to-blue-700 transition-all
                     disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                     shadow-sm"
          aria-label="Generate Report"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={onTryExample}
        disabled={isLoading}
        className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
      >
        Try an example →
      </button>
    </form>
  );
}
