-- ENABLE RLS ON ALL TABLES
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-- Helper to make it re-runnable by dropping policies first
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "SuperAdmins can manage users" ON users;

-- Function to bypass RLS to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role::text FROM users WHERE id = auth.uid();
$$;

-- 1. USERS TABLE
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "SuperAdmins can manage users" ON users FOR ALL USING (
  get_user_role() = 'SUPER_ADMIN'
);

DROP POLICY IF EXISTS "Anyone can view problems" ON problems;
DROP POLICY IF EXISTS "Anyone can view examples" ON problem_examples;
DROP POLICY IF EXISTS "Anyone can view constraints" ON problem_constraints;
DROP POLICY IF EXISTS "Anyone can view public test cases" ON test_cases;
DROP POLICY IF EXISTS "Admins can manage problems" ON problems;
DROP POLICY IF EXISTS "Admins can manage examples" ON problem_examples;
DROP POLICY IF EXISTS "Admins can manage constraints" ON problem_constraints;
DROP POLICY IF EXISTS "Admins can manage test cases" ON test_cases;

-- 2. PROBLEMS & RELATED TABLES
CREATE POLICY "Anyone can view problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Anyone can view examples" ON problem_examples FOR SELECT USING (true);
CREATE POLICY "Anyone can view constraints" ON problem_constraints FOR SELECT USING (true);
CREATE POLICY "Anyone can view public test cases" ON test_cases FOR SELECT USING (hidden = false OR get_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "Admins can manage problems" ON problems FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);
CREATE POLICY "Admins can manage examples" ON problem_examples FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);
CREATE POLICY "Admins can manage constraints" ON problem_constraints FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);
CREATE POLICY "Admins can manage test cases" ON test_cases FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);

DROP POLICY IF EXISTS "Users can view their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can view and manage their own notes" ON notes;
DROP POLICY IF EXISTS "Users can view and manage their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Anyone can update user_statistics" ON user_statistics;
DROP POLICY IF EXISTS "Users can update their own statistics" ON user_statistics;
DROP POLICY IF EXISTS "Users can view their own placement scores" ON placement_scores;
DROP POLICY IF EXISTS "Users can manage their own learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view all achievements" ON achievements;
DROP POLICY IF EXISTS "Users can manage their own achievements" ON achievements;

-- 3. USER PRIVATE DATA
CREATE POLICY "Users can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view and manage their own notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view and manage their own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can update user_statistics" ON user_statistics FOR UPDATE USING (true);
CREATE POLICY "Users can update their own statistics" ON user_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own placement scores" ON placement_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own learning paths" ON learning_paths FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view all achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage their own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view daily challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Admins can manage daily challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Anyone can view contests" ON contests;
DROP POLICY IF EXISTS "Admins can manage contests" ON contests;

-- 4. PUBLIC DATA
CREATE POLICY "Anyone can view daily challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Admins can manage daily challenges" ON daily_challenges FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);
CREATE POLICY "Anyone can view contests" ON contests FOR SELECT USING (true);
CREATE POLICY "Admins can manage contests" ON contests FOR ALL USING (
  get_user_role() IN ('ADMIN', 'SUPER_ADMIN')
);

DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
DROP POLICY IF EXISTS "Hosts can update their rooms" ON rooms;
DROP POLICY IF EXISTS "Anyone can view room participants" ON room_participants;
DROP POLICY IF EXISTS "Users can join rooms" ON room_participants;
DROP POLICY IF EXISTS "Room participants can view announcements" ON room_announcements;
DROP POLICY IF EXISTS "Hosts can create announcements" ON room_announcements;
DROP POLICY IF EXISTS "Room participants can view/send chat" ON room_chat_messages;
DROP POLICY IF EXISTS "Users can view challenges they are in" ON challenges;
DROP POLICY IF EXISTS "Users can create challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update challenges they are in" ON challenges;

-- 5. ROOMS & CHALLENGES
CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Users can create rooms" ON rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their rooms" ON rooms FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Anyone can view room participants" ON room_participants FOR SELECT USING (true);
CREATE POLICY "Users can manage their participation" ON room_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Room participants can view announcements" ON room_announcements FOR SELECT USING (
  EXISTS (SELECT 1 FROM room_participants WHERE room_id = room_announcements.room_id AND user_id = auth.uid())
);
CREATE POLICY "Hosts can create announcements" ON room_announcements FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Room participants can view/send chat" ON room_chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM room_participants WHERE room_id = room_chat_messages.room_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can view challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = player1_id);
CREATE POLICY "Users can update challenges" ON challenges FOR UPDATE USING (true);

-- Storage Policies for Avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- AVATARS STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/png', 'image/jpg', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Users can delete their own avatar." ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);
