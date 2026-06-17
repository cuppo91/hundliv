create table reports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade,
  reason text not null,
  ip_hash text not null,
  created_at timestamptz default now()
);

-- Prevent same IP from reporting same place twice
create unique index on reports (place_id, ip_hash);

-- Count helper view
create view place_report_counts as
  select place_id, count(*) as report_count
  from reports
  group by place_id;

alter table reports enable row level security;
create policy "Public insert reports" on reports for insert with check (true);
