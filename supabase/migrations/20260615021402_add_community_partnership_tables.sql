
-- Partnership applications table
CREATE TABLE partnership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  org_type text NOT NULL CHECK (org_type IN ('government', 'ngo', 'academic', 'private', 'community', 'media', 'other')),
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  province text,
  interest text NOT NULL,
  message text,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'declined')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partnership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_partnerships" ON partnership_applications FOR SELECT TO anon USING (true);
CREATE POLICY "insert_partnerships" ON partnership_applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_partnerships" ON partnership_applications FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_partnerships" ON partnership_applications FOR DELETE TO anon USING (true);

-- Community members / newsletter signups
CREATE TABLE community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'activist', 'researcher', 'journalist', 'government', 'other')),
  province text,
  motivation text,
  newsletter boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_members" ON community_members FOR SELECT TO anon USING (true);
CREATE POLICY "insert_members" ON community_members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "update_members" ON community_members FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_members" ON community_members FOR DELETE TO anon USING (true);
