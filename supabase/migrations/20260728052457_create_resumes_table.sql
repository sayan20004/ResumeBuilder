/*
# Create resumes table (single-tenant, no auth)

1. New Tables
- `resumes`
- `id` (uuid, primary key)
- `title` (text, not null) — a user-facing label for the resume (e.g. "Software Engineer CV")
- `data` (jsonb, not null) — the full structured resume content: personal info, summary, experience, education, skills, projects, etc.
- `theme` (text, not null, default 'modern') — which theme to render with
- `accent_color` (text, default '#2563eb') — accent color override
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

2. Security
- Enable RLS on `resumes`.
- Single-tenant (no sign-in): allow anon + authenticated full CRUD because the data is intentionally shared/public within this app instance.
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Resume',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  theme text NOT NULL DEFAULT 'modern',
  accent_color text NOT NULL DEFAULT '#2563eb',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_resumes" ON resumes;
CREATE POLICY "anon_select_resumes" ON resumes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_resumes" ON resumes;
CREATE POLICY "anon_insert_resumes" ON resumes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_resumes" ON resumes;
CREATE POLICY "anon_update_resumes" ON resumes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_resumes" ON resumes;
CREATE POLICY "anon_delete_resumes" ON resumes FOR DELETE
  TO anon, authenticated USING (true);
