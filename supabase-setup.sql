-- Run this in the Supabase SQL Editor at supabase.com
-- Dashboard → your project → SQL Editor → New query → paste this → Run
-- Safe to re-run — everything uses IF NOT EXISTS / ON CONFLICT / DROP IF EXISTS

-- ══════════════════════════════════════
-- 1. SUBMISSIONS TABLE
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add media_type column if it doesn't already exist
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image', 'video', 'text'));

-- Widen media_type check to include 'text' (text-only submissions)
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_media_type_check;
ALTER TABLE submissions ADD CONSTRAINT submissions_media_type_check
  CHECK (media_type IN ('image', 'video', 'text'));

-- Add relationship column if it doesn't already exist
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS relationship TEXT NOT NULL DEFAULT 'other'
    CHECK (relationship IN ('family', 'friend', 'colleague', 'other'));

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit" ON submissions;
DROP POLICY IF EXISTS "Anyone can read approved" ON submissions;

CREATE POLICY "Anyone can submit"
  ON submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved"
  ON submissions FOR SELECT
  USING (status = 'approved');

-- ══════════════════════════════════════
-- 2. STORAGE BUCKET + POLICIES
-- ══════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('photos', 'photos', true, 209715200)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 209715200;

DROP POLICY IF EXISTS "Allow photo reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow photo uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow photo deletes" ON storage.objects;

CREATE POLICY "Allow photo reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "Allow photo uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow photo deletes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos');

-- ══════════════════════════════════════
-- 3. PLACEHOLDER ENTRY
-- ══════════════════════════════════════
INSERT INTO submissions (title, photo_url, description, submitter_name, submitter_email, status, media_type, relationship)
VALUES (
  'A Glass Raised to a Great Mentor',
  'https://images.unsplash.com/photo-1519671282429-b8b71b191e12?w=800&q=80',
  'I met Steve at a bartenders guild event in San Francisco years ago. He spent an hour with me explaining the story behind Bulleit — not just the bourbon, but the history, the craft, the people behind it. Most people with his level of expertise keep it for themselves. Steve gave it away freely. That hour changed how I think about this industry.',
  'A Friend from the Guild',
  'placeholder@example.com',
  'approved',
  'image',
  'colleague'
)
ON CONFLICT DO NOTHING;
