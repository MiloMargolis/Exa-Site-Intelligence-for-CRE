'use client';

import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export default function ErrorState({ message, onRetry, onReset }: ErrorStateProps) {
  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Generate Report
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white 
                       bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 
                       bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            New Address
          </button>
        </div>
      </div>
    </div>
  );
}
