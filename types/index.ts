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
  max_players?: number;
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

export type TennisExperienceYears = '1-2 years' | '3-5 years' | '6-8 years' | '>8 years';
export type PlayFrequency = '1 time' | '2-3 times' | '3-4 times' | '>4 times';
export type BedroomType = 'shared' | 'private_double';
export type RegistrationStatus = 'pending' | 'awaiting_manual_verification' | 'confirmed' | 'cancelled';
export type PaymentMethod = 'stripe' | 'revolut';
export type PaymentType = 'deposit' | 'full' | 'balance';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type RegistrationOptionType = 'hammam_massage' | 'massage' | 'hammam' | 'medina_tour' | 'friday_dinner';

export interface Registration {
  id: string;
  camp_id: string;
  name: string;
  email: string;
  whatsapp_number: string;
  tennis_experience_years: TennisExperienceYears;
  play_frequency_per_month: PlayFrequency;
  bedroom_type: BedroomType;
  accepted_cancellation_policy: boolean;
  status: RegistrationStatus;
  created_at: string;
  updated_at: string;
  camp?: Camp;
  options?: RegistrationOption[];
  /** API/DB may return snake_case; both supported for compatibility */
  registration_options?: RegistrationOption[];
  payments?: Payment[];
}

export interface RegistrationOption {
  id: string;
  registration_id: string;
  option_type: RegistrationOptionType;
  price_pounds: number;
  created_at: string;
}

export interface Payment {
  id: string;
  registration_id: string;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  amount_pounds: number;
  stripe_payment_intent_id?: string | null;
  stripe_session_id?: string | null;
  revolut_reference?: string | null;
  status: PaymentStatus;
  base_camp_price: number;
  bedroom_upgrade_price: number;
  options_total_price: number;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}