-- Relic Curator Database Schema
-- Digital Archaeologist for Heritage Preservation

-- 1. User profiles (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_public_view" ON profiles FOR SELECT USING (true);

-- 2. Relics - the core artifacts
CREATE TABLE IF NOT EXISTS relics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  story TEXT,
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN ('artifact', 'practice', 'profession', 'story', 'language', 'everyday')),
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Cultural context
  origin_region TEXT,
  origin_country TEXT,
  cultural_group TEXT,
  time_period TEXT,
  estimated_era TEXT,
  
  -- AI-generated metadata
  ai_significance TEXT,
  ai_preservation_urgency INTEGER CHECK (ai_preservation_urgency >= 1 AND ai_preservation_urgency <= 10),
  ai_related_traditions TEXT[] DEFAULT '{}',
  
  -- Temporal analysis (past-present-future)
  ai_current_relevance TEXT,
  ai_future_importance TEXT,
  ai_time_capsule_note TEXT,
  ai_museum_ready BOOLEAN DEFAULT false,
  
  -- Media
  primary_image_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_verified BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE relics ENABLE ROW LEVEL SECURITY;

-- Users can view published relics
CREATE POLICY "relics_public_view" ON relics FOR SELECT USING (status = 'published');
-- Users can view their own relics regardless of status
CREATE POLICY "relics_owner_view" ON relics FOR SELECT USING (auth.uid() = user_id);
-- Users can insert their own relics
CREATE POLICY "relics_insert" ON relics FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own relics
CREATE POLICY "relics_update" ON relics FOR UPDATE USING (auth.uid() = user_id);
-- Users can delete their own relics
CREATE POLICY "relics_delete" ON relics FOR DELETE USING (auth.uid() = user_id);

-- 3. Media attachments (images, audio, video)
CREATE TABLE IF NOT EXISTS relic_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relic_id UUID NOT NULL REFERENCES relics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  blob_url TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  
  caption TEXT,
  ai_description TEXT,
  transcript TEXT,
  
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE relic_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_public_view" ON relic_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM relics WHERE relics.id = relic_media.relic_id AND relics.status = 'published')
);
CREATE POLICY "media_owner_view" ON relic_media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "media_insert" ON relic_media FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_update" ON relic_media FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "media_delete" ON relic_media FOR DELETE USING (auth.uid() = user_id);

-- 4. QR codes for relics
CREATE TABLE IF NOT EXISTS relic_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relic_id UUID REFERENCES relics(id) ON DELETE CASCADE,
  
  code TEXT UNIQUE NOT NULL,
  qr_type TEXT NOT NULL CHECK (qr_type IN ('view', 'ar', 'contribute')),
  
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE relic_qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qr_public_view" ON relic_qr_codes FOR SELECT USING (true);
CREATE POLICY "qr_owner_manage" ON relic_qr_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM relics WHERE relics.id = relic_qr_codes.relic_id AND relics.user_id = auth.uid())
);

-- 5. Conversations with the curator agent
CREATE TABLE IF NOT EXISTS curator_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE curator_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_owner" ON curator_conversations FOR ALL USING (
  auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL)
);

-- 6. Collections (user-curated groups)
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collections_public_view" ON collections FOR SELECT USING (is_public = true);
CREATE POLICY "collections_owner" ON collections FOR ALL USING (auth.uid() = user_id);

-- 7. Collection items
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  relic_id UUID NOT NULL REFERENCES relics(id) ON DELETE CASCADE,
  
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(collection_id, relic_id)
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collection_items_public_view" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.is_public = true)
);
CREATE POLICY "collection_items_owner" ON collection_items FOR ALL USING (
  EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER relics_updated_at
  BEFORE UPDATE ON relics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON curator_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_relics_user_id ON relics(user_id);
CREATE INDEX IF NOT EXISTS idx_relics_status ON relics(status);
CREATE INDEX IF NOT EXISTS idx_relics_category ON relics(category);
CREATE INDEX IF NOT EXISTS idx_relics_created_at ON relics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_relic_media_relic_id ON relic_media(relic_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON relic_qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
