import React, { useState } from 'react';
import { Compass, Calendar, MapPin, Clock, Sun, Plane, Hotel, Utensils } from 'lucide-react';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { AuthModal } from './components/AuthModal';
import { WeatherDisplay } from './components/WeatherDisplay';
import CostEstimator from './components/CostEstimator';
import PackingList from './components/PackingList';
import { useAuth } from './hooks/useAuth';
import { useTrip } from './hooks/useTrip';
import { Trip, TripPreferences } from './types';

function App() {
  const [generatedTrip, setGeneratedTrip] = useState<Trip | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const { generateTrip, loading: tripLoading, error: tripError } = useTrip();

  const handleTripGeneration = async (preferences: TripPreferences) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const trip = await generateTrip(preferences);
    if (trip) {
      setGeneratedTrip(trip);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Compass className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">AI Travel Planner</span>
            </div>
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div 
        className="relative pt-16"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-black/40 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                Your AI-Powered Travel Companion
              </h1>
              <p className="text-xl text-gray-200">
                Tell us your dream vacation, and let AI craft the perfect itinerary
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TripForm onSubmit={handleTripGeneration} loading={tripLoading} />
          {tripError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {tripError}
            </div>
          )}
          {generatedTrip && (
            <div className="space-y-8">
              <ItineraryDisplay trip={generatedTrip} />
              {generatedTrip.cost_estimate && (
                <CostEstimator estimate={generatedTrip.cost_estimate} />
              )}
              {generatedTrip.packing_list && (
                <PackingList items={generatedTrip.packing_list} />
              )}
              <WeatherDisplay weatherData={generatedTrip.weather_data} />
            </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 text-indigo-600" />}
            title="Smart Scheduling"
            description="AI-optimized itineraries based on your preferences and real-time data"
          />
          <FeatureCard
            icon={<MapPin className="h-6 w-6 text-indigo-600" />}
            title="Location Intelligence"
            description="Discover hidden gems and popular attractions tailored to your interests"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-indigo-600" />}
            title="Real-time Updates"
            description="Dynamic adjustments based on weather, traffic, and local events"
          />
          <FeatureCard
            icon={<Sun className="h-6 w-6 text-indigo-600" />}
            title="Personalized Experience"
            description="Customized recommendations based on your travel style"
          />
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:scale-105">
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;