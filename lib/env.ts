const defaults = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_SITE_NAME: "Abhishek Raj",
  NEXT_PUBLIC_CONTACT_EMAIL: "abhishekr359@gmail.com",
  NEXT_PUBLIC_CONTACT_PHONE: "+91-9262648753",
  NEXT_PUBLIC_CONTACT_LOCATION: "Haryana, India",
  NEXT_PUBLIC_LINKEDIN_URL: "https://linkedin.com/in/abhishekrajverma",
} as const;

function getEnv(key: keyof typeof defaults): string {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : defaults[key];
}

export const env = {
  siteUrl: getEnv("NEXT_PUBLIC_SITE_URL"),
  siteName: getEnv("NEXT_PUBLIC_SITE_NAME"),
  email: getEnv("NEXT_PUBLIC_CONTACT_EMAIL"),
  phone: getEnv("NEXT_PUBLIC_CONTACT_PHONE"),
  location: getEnv("NEXT_PUBLIC_CONTACT_LOCATION"),
  linkedin: getEnv("NEXT_PUBLIC_LINKEDIN_URL"),
};
