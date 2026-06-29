-- Add optional HR / recruiter phone number to contact form submissions
alter table public.contact_messages
  add column if not exists phone text;
