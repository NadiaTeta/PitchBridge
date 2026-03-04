/**
 * Client-side email validation (format + disposable domains).
 * Backend performs the same checks; this gives immediate feedback.
 */

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'mailinator.net', 'guerrillamail.com', 'guerrillamail.org',
  '10minutemail.com', '10minutemail.net', 'temp-mail.org', 'tempmail.com',
  'throwaway.email', 'fakeinbox.com', 'trashmail.com', 'yopmail.com',
  'getnada.com', 'maildrop.cc', 'tempail.com', 'sharklasers.com',
  'dispostable.com', 'mohmal.com', 'tempinbox.com', 'mintemail.com',
  'mytemp.email', 'tmpeml.com', 'disposable.com', 'mailnesia.com',
  'mailinator2.com', 'minuteinbox.com', 'emailfake.com', 'mail-temp.com',
  'discard.email', 'discardmail.com', 'getairmail.com', 'mailsac.com',
  'mail.tm', 'ethereal.email', 'mailtrap.io', 'sandbox.mailtrap.io',
].map((d) => d.toLowerCase()));

export function validateEmailForRegistration(email: string): { valid: boolean; message?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) return { valid: false, message: 'Email is required' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: 'Please enter a valid email address' };
  const domain = trimmed.split('@')[1]?.toLowerCase() || '';
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      message: 'Temporary or disposable email addresses are not allowed. Please use your real email.',
    };
  }
  return { valid: true };
}
