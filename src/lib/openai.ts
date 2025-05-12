import OpenAI from 'openai';
import { TripPreferences } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateTripSuggestions(preferences: TripPreferences) {
  const systemPrompt = `You are an expert travel planner. Create a detailed travel itinerary based on user preferences. Your response must be a valid JSON object with this exact structure:
  {
    "destination": "city, country",
    "activities": [
      {
        "day": number,
        "items": [
          {
            "type": "activity" | "accommodation" | "transportation",
            "name": "string",
            "time": "HH:MM"
          }
        ]
      }
    ],
    "recommendations": {
      "hotels": ["string"],
      "restaurants": ["string"],
      "activities": ["string"]
    },
    "cost_estimate": {
      "accommodation": number,
      "transportation": number,
      "activities": number,
      "food": number,
      "miscellaneous": number,
      "total": number,
      "currency": "USD"
    },
    "packing_list": [
      {
        "name": "string",
        "category": "clothing" | "toiletries" | "electronics" | "documents" | "miscellaneous",
        "essential": boolean
      }
    ]
  }

  Important: Return ONLY the JSON object, with no additional text or explanation.`;

  const userPrompt = `Create a travel itinerary with these exact preferences:
    - Description: ${preferences.description}
    - Duration: ${preferences.duration} days
    - Budget: ${preferences.budget}
    - Travel Style: ${preferences.travelStyle}
    
    Requirements:
    1. Include local attractions and activities
    2. Add cultural experiences
    3. Include all transportation details
    4. Suggest specific restaurants
    5. Recommend actual hotels
    6. Ensure realistic timing with proper breaks
    7. Format times as HH:MM (24-hour format)
    8. Provide detailed cost estimates based on the budget level
    9. Generate a comprehensive packing list based on the destination, duration, and activities`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);
      
      // Validate the response structure
      if (!parsed.destination || !Array.isArray(parsed.activities) || !parsed.recommendations) {
        throw new Error('Invalid response structure');
      }

      return parsed;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse trip suggestions');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate trip suggestions');
  }
}