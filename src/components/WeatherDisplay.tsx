import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface WeatherDisplayProps {
  weatherData: any;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  if (!weatherData || !weatherData.forecast) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherData.forecast.forecastday.map((day: any) => (
          <div key={day.date} className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-600">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="my-2">
              {day.day.condition.text.includes('rain') ? (
                <CloudRain className="w-8 h-8 mx-auto text-blue-500" />
              ) : day.day.condition.text.includes('cloud') ? (
                <Cloud className="w-8 h-8 mx-auto text-gray-500" />
              ) : (
                <Sun className="w-8 h-8 mx-auto text-yellow-500" />
              )}
            </div>
            <div className="font-medium">
              {Math.round(day.day.maxtemp_c)}°C / {Math.round(day.day.mintemp_c)}°C
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}