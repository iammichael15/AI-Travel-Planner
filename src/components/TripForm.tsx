import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, MapPin } from 'lucide-react';
import { TripPreferences } from '../types';

interface TripFormProps {
  onSubmit: (preferences: TripPreferences) => void;
  loading?: boolean;
}

function TripForm({ onSubmit, loading }: TripFormProps) {
  const [preferences, setPreferences] = useState<TripPreferences>({
    description: '',
    duration: 7,
    budget: 'MEDIUM',
    travelStyle: 'BALANCED'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Describe Your Dream Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your ideal trip
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
            placeholder="E.g., I want a relaxing beach vacation in Southeast Asia with some cultural experiences..."
            value={preferences.description}
            onChange={(e) => setPreferences({ ...preferences, description: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="number"
              min={1}
              max={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={preferences.duration}
              onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) })}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Level
          </label>
          <div className="flex items-center space-x-4">
            {['BUDGET', 'MEDIUM', 'LUXURY'].map((budget) => (
              <button
                key={budget}
                type="button"
                className={`flex-1 px-4 py-2 rounded-md ${
                  preferences.budget === budget 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPreferences({ ...preferences, budget: budget as TripPreferences['budget'] })}
                disabled={loading}
              >
                {budget.charAt(0) + budget.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <div className="flex items-center space-x-4">
            {['RELAXED', 'BALANCED', 'ACTIVE'].map((style) => (
              <button
                key={style}
                type="button"
                className={`flex-1 px-4 py-2 rounded-md ${
                  preferences.travelStyle === style 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPreferences({ ...preferences, travelStyle: style as TripPreferences['travelStyle'] })}
                disabled={loading}
              >
                {style.charAt(0) + style.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Generating Trip Plan...' : 'Generate My Trip Plan'}
        </button>
      </form>
    </div>
  );
}

export default TripForm;