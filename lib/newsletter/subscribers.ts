import {
  addSubscriber,
  getSubscribers,
  removeSubscriber,
} from "@/lib/newsletter/store";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim().toLowerCase());
}

export async function subscribeEmail(email: string): Promise<boolean> {
  return addSubscriber(email);
}

export async function unsubscribeEmail(email: string): Promise<void> {
  await removeSubscriber(email);
}

export async function listSubscriberEmails(): Promise<string[]> {
  return getSubscribers();
}
