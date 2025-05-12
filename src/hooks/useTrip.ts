import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateTripSuggestions } from '../lib/openai';
import { getWeatherForecast } from '../lib/weather';
import { Trip, TripPreferences } from '../types';

export function useTrip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTrip = async (preferences: TripPreferences): Promise<Trip | null> => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create or update user profile
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email
        }, {
          onConflict: 'id'
        });

      if (userError) {
        console.error('Failed to ensure user profile:', userError);
        throw new Error('Failed to create user profile');
      }

      // Generate trip suggestions with error handling
      let aiSuggestions;
      try {
        aiSuggestions = await generateTripSuggestions(preferences);
      } catch (aiError) {
        console.error('Failed to generate trip suggestions:', aiError);
        throw new Error('Failed to generate trip suggestions');
      }

      // Get weather forecast with error handling
      let weatherData;
      try {
        weatherData = await getWeatherForecast(aiSuggestions.destination, preferences.duration);
      } catch (weatherError) {
        console.error('Failed to fetch weather data:', weatherError);
        throw new Error('Failed to fetch weather information');
      }

      // Save trip to database
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          destination: aiSuggestions.destination,
          duration: preferences.duration,
          budget: preferences.budget,
          travel_style: preferences.travelStyle,
          description: preferences.description,
          weather_data: weatherData,
          ai_suggestions: aiSuggestions
        })
        .select()
        .single();

      if (tripError) {
        console.error('Failed to save trip:', tripError);
        throw new Error('Failed to save trip details');
      }

      // Save activities
      const activities = aiSuggestions.activities.flatMap((day: any) =>
        day.items.map((item: any) => ({
          trip_id: tripData.id,
          day: day.day,
          type: item.type,
          name: item.name,
          time: item.time
        }))
      );

      const { error: activitiesError } = await supabase
        .from('activities')
        .insert(activities);

      if (activitiesError) {
        console.error('Failed to save activities:', activitiesError);
        throw new Error('Failed to save trip activities');
      }

      return {
        destination: aiSuggestions.destination,
        duration: preferences.duration,
        budget: preferences.budget,
        activities: aiSuggestions.activities,
        recommendations: aiSuggestions.recommendations,
        weather_data: weatherData
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate trip plan';
      setError(message);
      console.error('Trip generation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateTrip, loading, error };
}