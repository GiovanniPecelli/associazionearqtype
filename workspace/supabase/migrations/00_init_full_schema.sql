-- ==========================================
-- ARQtype Database Initialization Script
-- Consolidated Schema (v1.0)
-- Based on previous migrations up to 2026-02-08
-- ==========================================

-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Note: 'pg_cron' must be enabled via Dashboard if needed for scheduled tasks

-- 2. ENUMS & TYPES (Implicitly handled via text checks in this schema for simplicity)
-- ==========================================

-- 3. TABLES
-- ==========================================

-- 3.1 PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('host', 'architect', 'tasker', 'Host Elite', 'The Founder', 'Lead Developer', 'Head of HR', 'Executive')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_approved boolean DEFAULT false,
  display_name text,
  bio text,
  skills text,
  vibe_points bigint DEFAULT 0,
  level bigint DEFAULT 1,
  current_role_level text DEFAULT 'Tasker L1',
  xp bigint DEFAULT 0,
  tasks_completed_simple bigint DEFAULT 0,
  tasks_completed_medium bigint DEFAULT 0,
  tasks_completed_hard bigint DEFAULT 0
);

COMMENT ON COLUMN public.profiles.bio IS 'User biography/about section';
COMMENT ON COLUMN public.profiles.skills IS 'User skills and expertise (comma-separated)';

-- 3.2 WORKFLOW CATEGORIES
CREATE TABLE IF NOT EXISTS public.workflow_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3.3 WORKFLOWS
CREATE TABLE IF NOT EXISTS public.workflows (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,  -- Proposta (Proposal)
  obiettivo text,  -- Objective/Goal
  fasi text,  -- Phases breakdown
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'active', 'completed', 'rejected')),
  category_id uuid REFERENCES public.workflow_categories(id),
  architect_id uuid REFERENCES public.profiles(id),
  architect_proposto uuid REFERENCES public.profiles(id),  -- Proposed architect
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.4 TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  workflow_id uuid REFERENCES public.workflows(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done', 'pending_approval')),
  assigned_to uuid REFERENCES public.profiles(id),
  assigned_at timestamp with time zone,
  data_consegna timestamp with time zone,  -- Due date (Data Consegna)
  commenti_operativi text,  -- Operational comments
  output_risultato text,  -- Output/Result
  difficulty text DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  points_reward bigint DEFAULT 10,
  xp_reward bigint DEFAULT 100,
  points_awarded boolean DEFAULT false,
  required_competencies jsonb DEFAULT '[]'::jsonb,
  is_tutorial boolean DEFAULT false,
  min_level_access bigint DEFAULT 1,
  revision_feedback text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_required_competencies ON tasks USING GIN (required_competencies);

-- 3.5 DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text NOT NULL, -- 'file', 'link'
  url text NOT NULL,
  hashtags text[],
  uploaded_by uuid REFERENCES public.profiles(id),
  mime_type text,
  size bigint,
  only_host boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON COLUMN public.documents.only_host IS 'Controls whether document is visible only to hosts';

-- 3.6 WORKFLOW ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.workflow_attachments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  workflow_id uuid REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid REFERENCES public.profiles(id) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.7 CHAT & CHANNELS
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('public', 'private', 'role_restricted')),
  allowed_roles text[] DEFAULT NULL, 
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  content text NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel text NOT NULL, -- slug reference
  attachment_url text,
  attachment_type text,
  attachment_name text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_channel ON public.messages(channel);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 3.8 GAMIFICATION (Trainings & Store)
CREATE TABLE IF NOT EXISTS public.trainings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  content_url text,
  level_required integer DEFAULT 1,
  xp_reward integer DEFAULT 100,
  vibe_points_reward integer DEFAULT 50,
  role_required text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_trainings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  training_id uuid REFERENCES public.trainings(id) ON DELETE CASCADE,
  status text DEFAULT 'started', -- 'started', 'completed'
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, training_id)
);

CREATE TABLE IF NOT EXISTS public.store_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text,
  cost_vibe_points integer NOT NULL DEFAULT 0,
  min_level_required integer DEFAULT 1,
  type text DEFAULT 'digital', -- 'skin', 'badge', 'feature'
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.store_items(id) ON DELETE CASCADE,
  equipped boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- 3.9 COMPETENCIES
CREATE TABLE IF NOT EXISTS public.competencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  category text DEFAULT 'general',
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_competencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  competency_id uuid REFERENCES public.competencies(id) ON DELETE CASCADE,
  acquired_via text DEFAULT 'manual',
  acquired_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, competency_id)
);

CREATE INDEX IF NOT EXISTS idx_user_competencies_user_id ON user_competencies(user_id);

-- 3.10 DISCORD SETTINGS
CREATE TABLE IF NOT EXISTS public.discord_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  voice_channel_url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_settings ENABLE ROW LEVEL SECURITY;

-- 4.1 PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4.2 WORKFLOWS POLICIES
CREATE POLICY "Workflows are viewable by everyone" ON public.workflows FOR SELECT USING (true);
CREATE POLICY "Everyone can propose workflows" ON public.workflows FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Host and assigned Architect can update workflows" ON public.workflows FOR UPDATE USING ( 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host') OR architect_id = auth.uid()
);

-- 4.3 TASKS POLICIES
CREATE POLICY "Tasks are viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Architects and Hosts can create tasks" ON public.tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'architect'))
);
CREATE POLICY "Hosts can update any task" ON public.tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host')
);
CREATE POLICY "Architects can update non-pending tasks" ON public.tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'architect') AND status <> 'pending_approval'
);
CREATE POLICY "Assigned users can update their non-pending tasks" ON public.tasks FOR UPDATE USING (
  assigned_to = auth.uid() AND status <> 'pending_approval'
);

-- 4.4 DOCUMENTS POLICIES
CREATE POLICY "View documents based on visibility" ON public.documents FOR SELECT USING (
  only_host = false OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'Host Elite', 'The Founder', 'Lead Developer', 'Head of HR', 'Executive'))
);
CREATE POLICY "Hosts and owners can delete documents" ON public.documents FOR DELETE USING (
  auth.uid() = uploaded_by OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'Host Elite', 'The Founder', 'Lead Developer', 'Head of HR', 'Executive'))
);
CREATE POLICY "Hosts can update documents" ON public.documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'Host Elite', 'The Founder', 'Lead Developer', 'Head of HR', 'Executive'))
);
-- Allow uploads (previously 'Authenticated users can upload documents')
CREATE POLICY "Authenticated users can upload documents" ON public.documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 4.5 WORKFLOW ATTACHMENTS POLICIES
CREATE POLICY "Everyone can view workflow attachments" ON public.workflow_attachments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload workflow attachments" ON public.workflow_attachments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own workflow attachments" ON public.workflow_attachments FOR DELETE USING (auth.uid() = uploaded_by);

-- 4.6 CHANNELS & MESSAGES POLICIES
-- Channels
CREATE POLICY "Everyone approved can view public channels" ON public.channels FOR SELECT USING (
  type = 'public' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "Allowed roles can view role_restricted channels" ON public.channels FOR SELECT USING (
  type = 'role_restricted' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = ANY(allowed_roles) OR role = 'host'))
);
CREATE POLICY "Hosts can create channels" ON public.channels FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host')
);

-- Messages
CREATE POLICY "Access messages based on channel permissions" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.channels c WHERE c.slug = messages.channel AND (
      (c.type = 'public' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true)) OR
      (c.type = 'role_restricted' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = ANY(c.allowed_roles) OR role = 'host')))
    )
  )
);
CREATE POLICY "Insert messages based on channel permissions" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.channels c WHERE c.slug = messages.channel AND (
      (c.type = 'public' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true)) OR
      (c.type = 'role_restricted' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = ANY(c.allowed_roles) OR role = 'host')))
    )
  )
);

-- 4.7 GAMIFICATION POLICIES
-- Trainings
CREATE POLICY "Trainings are viewable by everyone" ON public.trainings FOR SELECT USING (true);
-- User Trainings
CREATE POLICY "Users can view own training progress" ON public.user_trainings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own training progress" ON public.user_trainings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify own training progress" ON public.user_trainings FOR UPDATE USING (auth.uid() = user_id);
-- Store Items
CREATE POLICY "Store items are viewable by everyone" ON public.store_items FOR SELECT USING (true);
-- User Inventory
CREATE POLICY "Users can view own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own inventory" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON public.user_inventory FOR UPDATE USING (auth.uid() = user_id);

-- 4.8 COMPETENCIES POLICIES
CREATE POLICY "Competencies are viewable by everyone" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Hosts can manage competencies" ON public.competencies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'dev', 'hr', 'founder', 'executive'))
);
CREATE POLICY "User competencies are viewable by everyone" ON public.user_competencies FOR SELECT USING (true);
CREATE POLICY "Admins can assign/remove competencies" ON public.user_competencies FOR ALL USING (
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('host', 'dev', 'hr', 'founder', 'executive'))
);

-- 4.9 DISCORD SETTINGS POLICIES
CREATE POLICY "Discord settings are viewable by everyone" ON public.discord_settings FOR SELECT USING (true);
CREATE POLICY "Hosts can manage Discord settings" ON public.discord_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host')
);

-- 5. FUNCTIONS & TRIGGERS
-- ==========================================

-- 5.1 Handle New User (Profile Creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'tasker');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5.2 Auto Assign Base Competencies
CREATE OR REPLACE FUNCTION auto_assign_base_competencies()
RETURNS TRIGGER AS $$
DECLARE
    base_competency_ids UUID[];
BEGIN
    IF NEW.level >= 3 AND (OLD.level IS NULL OR OLD.level < 3) THEN
        SELECT ARRAY_AGG(id) INTO base_competency_ids FROM competencies WHERE category = 'general' LIMIT 5;
        IF base_competency_ids IS NOT NULL THEN
            INSERT INTO user_competencies (user_id, competency_id, acquired_via)
            SELECT NEW.id, unnest(base_competency_ids), 'auto'
            ON CONFLICT (user_id, competency_id) DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_level_up ON profiles;
CREATE TRIGGER on_user_level_up
    AFTER UPDATE OF level ON profiles
    FOR EACH ROW EXECUTE FUNCTION auto_assign_base_competencies();

-- 5.3 Discord Settings Updated At
CREATE OR REPLACE FUNCTION public.update_discord_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS discord_settings_updated_at_trigger ON public.discord_settings;
CREATE TRIGGER discord_settings_updated_at_trigger
  BEFORE UPDATE ON public.discord_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_discord_settings_updated_at();

-- 5.4 Message Cleanup
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.messages WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$;

-- 6. SEED DATA (Optional Initial Data)
-- ==========================================

-- Base Channels
INSERT INTO public.channels (slug, name, type, allowed_roles)
VALUES 
  ('general', 'General Chat', 'public', NULL),
  ('architects', 'Architects Only', 'role_restricted', ARRAY['host', 'architect'])
ON CONFLICT (slug) DO NOTHING;

-- Base Store Items
INSERT INTO public.store_items (name, description, cost_vibe_points, type)
VALUES 
  ('Neon Blue Theme', 'Sblocca il tema Neon Blue per la tua dashboard.', 500, 'skin'),
  ('Badge "Early Adopter"', 'Badge esclusivo per i primi utenti.', 100, 'badge')
ON CONFLICT DO NOTHING;

-- 3.11 DEVELOPER REQUESTS
CREATE TABLE IF NOT EXISTS public.developer_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_by uuid REFERENCES auth.users(id),
  author_name text
);

-- 3.12 SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
  id bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  signup_enabled boolean DEFAULT true,
  maintenance_mode boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.10 DEVELOPER REQUESTS POLICIES
ALTER TABLE public.developer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all developer_requests" ON public.developer_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users on developer_requests" ON public.developer_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users on developer_requests" ON public.developer_requests FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users on developer_requests" ON public.developer_requests FOR DELETE USING (auth.role() = 'authenticated');

-- 4.11 SYSTEM SETTINGS POLICIES
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users on system_settings" ON public.system_settings FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users on system_settings" ON public.system_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6.1 SEED SYSTEM SETTINGS
INSERT INTO public.system_settings (id, signup_enabled)
VALUES (1, true)
ON CONFLICT (id) DO NOTHING;

