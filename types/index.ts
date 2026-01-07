export type UserRole = 'player' | 'coach' | 'admin';

export type PackageType = 'tennis_only' | 'stay_and_play' | 'luxury_stay_and_play' | 'no_tennis';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export interface Camp {
  id: string;
  start_date: string;
  end_date: string;
  package: PackageType;
  total_tennis_hours: number | null;
  accommodation_details: string | null;
  accommodation_name: string | null;
  accommodation_phone: string | null;
  accommodation_map_link: string | null;
  accommodation_photo_url: string | null;
  capacity: number;
  coach_id: string | null;
  created_at: string;
  coach?: User;
}

export interface CampPlayer {
  id: string;
  camp_id: string;
  player_id: string;
  created_at: string;
  camp?: Camp;
  player?: User;
}

export interface PreCampAssessment {
  id: string;
  player_id: string;
  camp_id: string;
  answers: {
    playing_experience?: string;
    skill_level?: string;
    dominant_hand?: string;
    goals?: string;
    strengths?: string;
    areas_to_improve?: string;
    previous_injuries?: string;
    additional_notes?: string;
  };
  completed_at: string;
  updated_at: string;
}

export interface PostCampReport {
  id: string;
  player_id: string;
  camp_id: string;
  coach_id: string;
  report_content: string;
  created_at: string;
  updated_at: string;
}

export interface CampSchedule {
  id: string;
  camp_id: string;
  schedule_date: string;
  schedule_content: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  type: 'food' | 'relax' | 'culture' | 'local' | 'museum';
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  location: string;
  priceRange?: '€' | '€€' | '€€€';
  photo: string;
  mapEmbedUrl: string;
  phone?: string;
  whatsapp?: boolean;
}

export interface Feedback {
  id: string;
  player_id: string;
  camp_id: string;
  accommodation_rating?: number | null;
  accommodation_text?: string | null;
  tennis_rating: number;
  tennis_text?: string | null;
  excursions_rating?: number | null;
  excursions_text?: string | null;
  overall_text?: string | null;
  photo_urls: string[];
  consent_given: boolean;
  created_at: string;
  updated_at: string;
  player?: User;
  camp?: Camp;
  // Legacy fields for backward compatibility
  overall_trip_text?: string;
  app_experience_text?: string;
}

