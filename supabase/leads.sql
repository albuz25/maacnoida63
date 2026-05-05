-- Run this in Supabase Dashboard > SQL Editor.
-- The app inserts through a server-side API route using SUPABASE_PUBLISHABLE_KEY.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  mobile text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  course_interest text not null check (
    course_interest in (
      '3D Animation',
      'VFX',
      'Game Design',
      'UI/UX',
      'Graphic Design',
      'B.Voc in Animation & VFX'
    )
  ),
  source text not null default 'maac-sector-63-landing',
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'not_interested')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_mobile_idx on public.leads (mobile);
create index if not exists leads_course_interest_idx on public.leads (course_interest);

alter table public.leads enable row level security;

drop policy if exists "Allow public lead inserts" on public.leads;

create policy "Allow public lead inserts"
on public.leads
for insert
to anon
with check (
  char_length(trim(name)) >= 2
  and mobile ~ '^[6-9][0-9]{9}$'
  and course_interest in (
    '3D Animation',
    'VFX',
    'Game Design',
    'UI/UX',
    'Graphic Design',
    'B.Voc in Animation & VFX'
  )
  and source = 'maac-sector-63-landing'
  and status = 'new'
  and notes is null
);

-- No select/update/delete policies are added, so public visitors can submit
-- leads but cannot read, edit, or delete lead records.
