export interface TripPreferences {
  description: string;
  duration: number;
  budget: 'BUDGET' | 'MEDIUM' | 'LUXURY';
  travelStyle: 'RELAXED' | 'BALANCED' | 'ACTIVE';
}

export interface TripActivity {
  type: 'activity' | 'accommodation' | 'transportation';
  name: string;
  time: string;
}

export interface TripDay {
  day: number;
  items: TripActivity[];
}

export interface CostEstimate {
  accommodation: number;
  transportation: number;
  activities: number;
  food: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

export interface PackingItem {
  name: string;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'miscellaneous';
  essential: boolean;
}

export interface Trip {
  destination: string;
  duration: number;
  budget: string;
  activities: TripDay[];
  recommendations: {
    hotels: string[];
    restaurants: string[];
    activities: string[];
  };
  weather_data?: any;
  cost_estimate?: CostEstimate;
  packing_list?: PackingItem[];
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          destination: string;
          duration: number;
          budget: string;
          travel_style: string;
          description: string;
          weather_data: any;
          ai_suggestions: any;
          cost_estimate: any;
          packing_list: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          destination: string;
          duration: number;
          budget: string;
          travel_style: string;
          description: string;
          weather_data?: any;
          ai_suggestions?: any;
          cost_estimate?: any;
          packing_list?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          destination?: string;
          duration?: number;
          budget?: string;
          travel_style?: string;
          description?: string;
          weather_data?: any;
          ai_suggestions?: any;
          cost_estimate?: any;
          packing_list?: any;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          trip_id: string;
          day: number;
          type: string;
          name: string;
          time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          day: number;
          type: string;
          name: string;
          time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          day?: number;
          type?: string;
          name?: string;
          time?: string;
          created_at?: string;
        };
      };
    };
  };
}