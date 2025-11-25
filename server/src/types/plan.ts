export interface PlanActivity {
  name: string;
  type: 'museum' | 'restaurant' | 'walk' | 'attraction' | 'transport' | 'accommodation' | 'other';
  time: string;
  cost_estimate: number;
  notes?: string;
  location?: string;
}

export interface PlanDay {
  day: number;
  date: string;
  activities: PlanActivity[];
  daily_cost?: number;
}

export interface TravelPlan {
  id?: string;
  userId: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: PlanDay[];
  total_estimated_cost: number;
  tips?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface PlannerInput {
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  participants: number;
  interests: string[];
  transport: string;
  accommodation: string;
  must_visit?: string[];
  avoid?: string[];
  intensity?: 'relaxed' | 'moderate' | 'active';
}

