-- Public projects storage bucket for project JSON and images
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public read access for projects storage"
on storage.objects
for select
to public
using (bucket_id = 'projects');
