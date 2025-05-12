const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeatherForecast(location: string, days: number) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=${days}&aqi=no`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}