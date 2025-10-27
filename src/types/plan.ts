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

export const ACTIVITY_TYPES = {
  museum: { label: 'Muzeum', icon: '🏛️', color: 'blue' },
  restaurant: { label: 'Restauracja', icon: '🍽️', color: 'orange' },
  walk: { label: 'Spacer', icon: '🚶', color: 'green' },
  attraction: { label: 'Atrakcja', icon: '🎡', color: 'purple' },
  transport: { label: 'Transport', icon: '🚗', color: 'gray' },
  accommodation: { label: 'Nocleg', icon: '🏨', color: 'indigo' },
  other: { label: 'Inne', icon: '📍', color: 'slate' },
} as const;

export const INTENSITY_OPTIONS = [
  { value: 'relaxed', label: 'Spokojny', description: 'Relaks i odpoczynek' },
  { value: 'moderate', label: 'Umiarkowany', description: 'Zrównoważony plan' },
  { value: 'active', label: 'Aktywny', description: 'Pełen atrakcji' },
] as const;

export const INTERESTS_OPTIONS = [
  { value: 'museums', label: 'Muzea i sztuka', icon: '🏛️' },
  { value: 'nature', label: 'Przyroda', icon: '🌲' },
  { value: 'food', label: 'Jedzenie', icon: '🍕' },
  { value: 'history', label: 'Historia', icon: '📜' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'nightlife', label: 'Życie nocne', icon: '🌃' },
  { value: 'sports', label: 'Sport', icon: '⚽' },
  { value: 'beach', label: 'Plaża', icon: '🏖️' },
  { value: 'architecture', label: 'Architektura', icon: '🏰' },
  { value: 'adventure', label: 'Przygoda', icon: '🏔️' },
] as const;

