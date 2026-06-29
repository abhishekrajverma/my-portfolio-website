-- Optional job description file metadata for recruiter contact submissions
alter table public.contact_messages
  add column if not exists jd_url text,
  add column if not exists jd_file_name text;
