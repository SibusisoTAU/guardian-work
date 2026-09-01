# Supabase Setup Guide for Guardian Work

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name:** guardian-work
   - **Database Password:** (Create a strong password)
   - **Region:** Select closest to South Africa (EU-West or similar)
5. Click "Create new project" (wait 2-3 minutes)

## Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon key** (public key for frontend)
   - **service_role key** (secret key - keep safe!)

## Step 3: Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  job TEXT NOT NULL,
  town TEXT NOT NULL,
  province TEXT NOT NULL,
  phone TEXT,
  exp TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES profiles(id),
  seeker_name TEXT NOT NULL,
  job TEXT NOT NULL,
  town TEXT NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW()
);

-- Community Posts Table
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  province TEXT NOT NULL,
  town TEXT NOT NULL,
  stars INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Community Replies Table
CREATE TABLE community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ads Table
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insights Table
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  prints INTEGER DEFAULT 0,
  town_name TEXT,
  view_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 4: Set Row Level Security (RLS)

Enable RLS on all tables (for production security):

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON community_replies FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON ads FOR SELECT USING (true);

-- Allow public insert/update for profiles
CREATE POLICY "Allow public insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON profiles FOR UPDATE USING (true);

-- Allow public insert for applications
CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);

-- Allow public insert for community
CREATE POLICY "Allow public insert" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON community_replies FOR INSERT WITH CHECK (true);
```

## Step 5: Environment Variables

Create a `.env.local` file in your project root:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Or add these to Vercel environment variables:
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add the two variables above

## Step 6: Files to Update

The following files need updates to use Supabase:
- `index.html` - Replace localStorage with Supabase calls
- `admin.html` - Use Supabase for admin data
- `community.html` - Sync with Supabase database

Files ready for Supabase integration will be provided next.

---

**Next Step:** Reply with "Setup complete" once you've:
1. Created Supabase project
2. Copied your API keys
3. Run the SQL commands
4. Set environment variables
