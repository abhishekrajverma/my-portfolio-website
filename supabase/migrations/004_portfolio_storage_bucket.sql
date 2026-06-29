-- Portfolio content storage bucket for site sections (skills, about, faqs, etc.)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public read access for portfolio storage"
on storage.objects
for select
to public
using (bucket_id = 'portfolio');
