import React from 'react';
import { Calendar, MapPin, Hotel, Utensils, Clock } from 'lucide-react';
import { Trip } from '../types';

interface ItineraryDisplayProps {
  trip: Trip;
}

function ItineraryDisplay({ trip }: ItineraryDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Personalized Itinerary</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          <span>{trip.duration} days</span>
        </div>
      </div>

      <div className="space-y-8">
        {trip.activities.map((day) => (
          <div key={day.day} className="border-b border-gray-200 pb-6 last:border-b-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Day {day.day}</h3>
            <div className="space-y-4">
              {day.items.map((item, index) => (
                <div key={index} className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                    <div className="text-gray-900">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <Hotel className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-900">Where to Stay</h4>
            </div>
            <ul className="space-y-2">
              {trip.recommendations.hotels.map((hotel, index) => (
                <li key={index} className="text-gray-600">{hotel}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <Utensils className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-900">Where to Eat</h4>
            </div>
            <ul className="space-y-2">
              {trip.recommendations.restaurants.map((restaurant, index) => (
                <li key={index} className="text-gray-600">{restaurant}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-900">What to Do</h4>
            </div>
            <ul className="space-y-2">
              {trip.recommendations.activities.map((activity, index) => (
                <li key={index} className="text-gray-600">{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDisplay;