alter table places add column if not exists user_ratings_total integer default 0;
alter table places add column if not exists dog_bonus numeric(3,1) default 0;
alter table places add column if not exists score numeric(5,2) default 0;

create index if not exists places_score_idx on places (score desc);
