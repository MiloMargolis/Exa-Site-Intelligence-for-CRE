'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Loader2, MapPin } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
  isLoading: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initGooglePlaces: () => void;
  }
}

export default function AddressInput({
  value,
  onChange,
  onSubmit,
  onTryExample,
  isLoading,
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    // Define callback
    window.initGooglePlaces = () => {
      setIsGoogleLoaded(true);
    };

    // Load Google Places script
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (apiKey && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || autocompleteRef.current) return;

    // Initialize autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'address_components'],
    });

    // Listen for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [isGoogleLoaded, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search any address..."
          className="w-full pl-12 pr-14 py-4 text-lg border border-gray-200 rounded-2xl 
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
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 
                   bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
      >
        <span>Try an example</span>
        <span className="text-gray-400">→</span>
        <span className="text-gray-600 font-medium">255 Elm St, Somerville MA</span>
      </button>
    </form>
  );
}
