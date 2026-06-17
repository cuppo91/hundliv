create table places (
  id uuid primary key default gen_random_uuid(),
  city_id text not null,
  name text not null,
  category text not null check (category in ('restaurant','cafe','park','activity','shop','vet')),
  address text not null,
  lat double precision not null,
  lng double precision not null,
  description text,
  phone text,
  website text,
  google_place_id text unique,
  rating numeric(2,1),
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on places (city_id);
create index on places (category);

-- Enable RLS, allow public reads
alter table places enable row level security;
create policy "Public read" on places for select using (true);
