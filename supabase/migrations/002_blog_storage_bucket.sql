-- Public blog storage bucket for post JSON and cover images
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public read access for blog storage"
on storage.objects
for select
to public
using (bucket_id = 'blog');
