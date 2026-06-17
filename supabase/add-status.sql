-- Add status to places table
alter table places add column if not exists status text not null default 'approved'
  check (status in ('pending', 'approved', 'rejected'));

-- User submissions also need a note field
alter table places add column if not exists submitted_by text;
alter table places add column if not exists submission_note text;

-- Index for admin review queue
create index if not exists on places (status);

-- Allow inserts from anon (for tip submissions)
create policy "Public insert pending" on places
  for insert with check (status = 'pending');
