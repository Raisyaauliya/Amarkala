import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type School = {
  id: string;
  npsn: string;
  name: string;
  level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'PKBM';
  province: string;
  city: string;
  address?: string;
  accreditation: string;
  student_count: number;
  kip_recipients: number;
  needs_rating: number;
  internet_access: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
};

export type KipRecord = {
  id: string;
  nik?: string;
  nisn?: string;
  name: string;
  school_id?: string;
  province: string;
  city: string;
  level: string;
  status: 'verified' | 'pending' | 'not_found' | 'rejected';
  amount: number;
  year: number;
  disbursement_date?: string;
  created_at: string;
};

export type BlindspotReport = {
  id: string;
  report_type: 'kip_not_received' | 'wrong_recipient' | 'school_needs' | 'data_error' | 'other';
  province: string;
  city: string;
  description: string;
  evidence_url?: string;
  contact_info?: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'closed';
  created_at: string;
};

export type Webinar = {
  id: string;
  title: string;
  speaker: string;
  speaker_title?: string;
  topic: string;
  description?: string;
  webinar_date: string;
  webinar_time: string;
  duration_minutes: number;
  platform: string;
  registration_url?: string;
  recording_url?: string;
  thumbnail_url?: string;
  is_upcoming: boolean;
  participant_count: number;
  created_at: string;
};
