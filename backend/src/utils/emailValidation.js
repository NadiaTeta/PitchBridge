/**
 * Email validation: format + block disposable/temporary email domains
 * so users must register with a real, deliverable email.
 */

// Standard email format (RFC-style, allows common TLDs including .co.uk, .com.au, etc.)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Disposable / temporary email domains (users must use a real email)
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'mailinator.net', 'guerrillamail.com', 'guerrillamail.org',
  '10minutemail.com', '10minutemail.net', 'temp-mail.org', 'tempmail.com',
  'throwaway.email', 'fakeinbox.com', 'trashmail.com', 'yopmail.com',
  'getnada.com', 'maildrop.cc', 'tempail.com', 'sharklasers.com',
  'guerrillamailblock.com', 'spam4.me', 'dispostable.com', 'mohmal.com',
  'emailondeck.com', 'tempinbox.com', 'mintemail.com', 'mytemp.email',
  'tmpeml.com', 'tempmailo.com', 'disposable.com', 'mailnesia.com',
  'mailinator2.com', 'inboxkitten.com', 'anonymbox.com', 'mvrht.com',
  'mailcatch.com', 'temp-mail.ru', 'minuteinbox.com', 'emailfake.com',
  'mail-temp.com', 'tempail.com', 'tempmail.com', 'fakeinbox.info',
  'discard.email', 'discardmail.com', 'getairmail.com', 'mailsac.com',
  'mail.tm', 'ethereal.email', 'mailtrap.io', 'sandbox.mailtrap.io'
].map(d => d.toLowerCase()));

function getEmailDomain(email) {
  const parts = String(email).trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

/**
 * Validate email format
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
function validateEmailFormat(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Please provide a valid email address' };
  }
  return { valid: true };
}

/**
 * Check if domain is disposable/temporary (not allowed for registration)
 * @param {string} email
 * @returns {{ allowed: boolean, message?: string }}
 */
function isDisposableEmail(email) {
  const domain = getEmailDomain(email);
  if (!domain) return { allowed: false, message: 'Invalid email' };
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      allowed: false,
      message: 'Temporary or disposable email addresses are not allowed. Please use your real email address.'
    };
  }
  return { allowed: true };
}

/**
 * Full validation: format + disposable check. Use before registration.
 * @param {string} email
 * @returns {{ valid: boolean, normalized?: string, message?: string }}
 */
function validateEmailForRegistration(email) {
  const formatResult = validateEmailFormat(email);
  if (!formatResult.valid) {
    return { valid: false, message: formatResult.message };
  }
  const normalized = email.trim().toLowerCase();
  const disposableResult = isDisposableEmail(normalized);
  if (!disposableResult.allowed) {
    return { valid: false, message: disposableResult.message };
  }
  return { valid: true, normalized };
}

module.exports = {
  validateEmailFormat,
  isDisposableEmail,
  validateEmailForRegistration,
  getEmailDomain
};
