
-- Schools table
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  npsn varchar(20) UNIQUE NOT NULL,
  name text NOT NULL,
  level varchar(10) NOT NULL CHECK (level IN ('SD', 'SMP', 'SMA', 'SMK', 'PKBM')),
  province text NOT NULL,
  city text NOT NULL,
  address text,
  accreditation varchar(5) DEFAULT 'B',
  student_count integer DEFAULT 0,
  kip_recipients integer DEFAULT 0,
  needs_rating integer DEFAULT 3 CHECK (needs_rating BETWEEN 1 AND 5),
  internet_access boolean DEFAULT false,
  latitude decimal(10,7),
  longitude decimal(10,7),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_schools" ON schools FOR SELECT TO anon USING (true);
CREATE POLICY "insert_schools" ON schools FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_schools" ON schools FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_schools" ON schools FOR DELETE TO anon USING (true);

-- KIP records table
CREATE TABLE kip_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nik varchar(20),
  nisn varchar(20),
  name text NOT NULL,
  school_id uuid REFERENCES schools(id),
  province text NOT NULL,
  city text NOT NULL,
  level varchar(10) NOT NULL,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'not_found', 'rejected')),
  amount integer DEFAULT 0,
  year integer DEFAULT 2025,
  disbursement_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kip_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_kip" ON kip_records FOR SELECT TO anon USING (true);
CREATE POLICY "insert_kip" ON kip_records FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_kip" ON kip_records FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_kip" ON kip_records FOR DELETE TO anon USING (true);

-- Blindspot reports table
CREATE TABLE blindspot_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL CHECK (report_type IN ('kip_not_received', 'wrong_recipient', 'school_needs', 'data_error', 'other')),
  province text NOT NULL,
  city text NOT NULL,
  description text NOT NULL,
  evidence_url text,
  contact_info text,
  status varchar(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blindspot_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_reports" ON blindspot_reports FOR SELECT TO anon USING (true);
CREATE POLICY "insert_reports" ON blindspot_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_reports" ON blindspot_reports FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_reports" ON blindspot_reports FOR DELETE TO anon USING (true);

-- Webinars table
CREATE TABLE webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  speaker text NOT NULL,
  speaker_title text,
  topic text NOT NULL,
  description text,
  webinar_date date NOT NULL,
  webinar_time time NOT NULL,
  duration_minutes integer DEFAULT 90,
  platform text DEFAULT 'Zoom',
  registration_url text,
  recording_url text,
  thumbnail_url text,
  is_upcoming boolean DEFAULT true,
  participant_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_webinars" ON webinars FOR SELECT TO anon USING (true);
CREATE POLICY "insert_webinars" ON webinars FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_webinars" ON webinars FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_webinars" ON webinars FOR DELETE TO anon USING (true);

-- Webinar registrations
CREATE TABLE webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id uuid REFERENCES webinars(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_reg" ON webinar_registrations FOR SELECT TO anon USING (true);
CREATE POLICY "insert_reg" ON webinar_registrations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_reg" ON webinar_registrations FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_reg" ON webinar_registrations FOR DELETE TO anon USING (true);
