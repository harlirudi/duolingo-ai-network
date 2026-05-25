-- Migration: Initial Schema
-- Tables: profiles, missions, affiliate_links, affiliate_clicks, products,
--          learning_modules, learning_progress, guilds, product_recommendations

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------
-- 1. Guilds (must be created before profiles due to FK)
------------------------------------------------------------
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  leader_id UUID,
  region TEXT,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- 2. Profiles
------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  archetype TEXT CHECK (archetype IN ('silent_builder','natural_seller','trend_hunter','trust_anchor')),
  archetype_confidence FLOAT DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  mentor_id UUID,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_mission_at TIMESTAMPTZ,
  guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE guilds ADD CONSTRAINT guilds_leader_fk
  FOREIGN KEY (leader_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE profiles ADD CONSTRAINT profiles_mentor_fk
  FOREIGN KEY (mentor_id) REFERENCES profiles(id) ON DELETE SET NULL;

------------------------------------------------------------
-- 3. Products
------------------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('physical','digital')),
  description TEXT,
  price DECIMAL,
  stock INTEGER,
  digital_file_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- 4. Missions
------------------------------------------------------------
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mission_type TEXT CHECK (mission_type IN ('caption','carousel','talking_head','trend_remix','learning','sales')),
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  suggested_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','skipped')),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_missions_profile_status ON missions(profile_id, status);

------------------------------------------------------------
-- 5. Affiliate Links
------------------------------------------------------------
CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  short_code TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  commission_earned DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- 6. Affiliate Clicks (immutable audit log)
------------------------------------------------------------
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES affiliate_links(id) ON DELETE CASCADE NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_affiliate_clicks_link ON affiliate_clicks(link_id);

------------------------------------------------------------
-- 7. Learning Modules
------------------------------------------------------------
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- 8. Learning Progress
------------------------------------------------------------
CREATE TABLE learning_progress (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (profile_id, module_id)
);

------------------------------------------------------------
-- 9. Product Recommendations
------------------------------------------------------------
CREATE TABLE product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  confidence FLOAT DEFAULT 0,
  accepted BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

------------------------------------------------------------
-- 10. Mentor Match Log (join table)
------------------------------------------------------------
CREATE TABLE mentor_match_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  matched_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_match_log ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own, mentor can read mentees
CREATE POLICY profiles_select ON profiles FOR SELECT USING (
  auth.uid() = id
);

CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (
  auth.uid() = id
);

CREATE POLICY profiles_update ON profiles FOR UPDATE USING (
  auth.uid() = id
) WITH CHECK (
  auth.uid() = id
);

-- Missions: user can CRUD own
CREATE POLICY missions_own ON missions FOR ALL USING (
  auth.uid() = profile_id
) WITH CHECK (
  auth.uid() = profile_id
);

-- Affiliate links: user can CRUD own
CREATE POLICY affiliate_links_own ON affiliate_links FOR ALL USING (
  auth.uid() = profile_id
) WITH CHECK (
  auth.uid() = profile_id
);

-- Affiliate clicks: app can insert, owner can select
CREATE POLICY affiliate_clicks_insert ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY affiliate_clicks_select ON affiliate_clicks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM affiliate_links al
    WHERE al.id = link_id AND al.profile_id = auth.uid()
  )
);

-- Products: all authenticated can view, only admin creates
CREATE POLICY products_select ON products FOR SELECT USING (auth.role() = 'authenticated');

-- Learning modules: all authenticated can view
CREATE POLICY learning_modules_select ON learning_modules FOR SELECT USING (auth.role() = 'authenticated');

-- Learning progress: user can CRUD own
CREATE POLICY learning_progress_own ON learning_progress FOR ALL USING (
  auth.uid() = profile_id
) WITH CHECK (
  auth.uid() = profile_id
);

-- Guilds: all authenticated can view
CREATE POLICY guilds_select ON guilds FOR SELECT USING (auth.role() = 'authenticated');

-- Product recommendations: user can view own
CREATE POLICY product_recommendations_own ON product_recommendations FOR SELECT USING (
  auth.uid() = profile_id
);

-- Mentor match: both parties can view
CREATE POLICY mentor_match_select ON mentor_match_log FOR SELECT USING (
  auth.uid() IN (mentor_id, mentee_id)
);
