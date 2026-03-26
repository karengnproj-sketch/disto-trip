// Security utilities for input validation and sanitization

export function sanitizeText(input: string, maxLength: number = 200): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeTextarea(input: string, maxLength: number = 2000): string {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function validateExternalUrl(url: string): string | null {
  const dangerous = ["javascript:", "data:", "vbscript:", "file:"];
  const lower = url.toLowerCase().trim();
  if (dangerous.some((d) => lower.startsWith(d))) return null;
  if (!isValidUrl(url)) return null;
  return url;
}

export function sanitizeUrlParam(input: string): string {
  return encodeURIComponent(input);
}

export function isValidLatLon(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function sanitizeError(error: unknown): string {
  // Never expose raw database or API errors to users
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("duplicate key") || msg.includes("unique constraint")) {
      return "This entry already exists.";
    }
    if (msg.includes("foreign key") || msg.includes("violates")) {
      return "A database error occurred. Please try again.";
    }
    if (msg.includes("invalid login") || msg.includes("invalid password")) {
      return "Invalid email or password. Please try again.";
    }
    if (msg.includes("email not confirmed")) {
      return "Please check your email and confirm your account first.";
    }
    if (msg.includes("rate limit") || msg.includes("too many")) {
      return "Too many attempts. Please wait a few minutes and try again.";
    }
  }
  return "Something went wrong. Please try again later.";
}

// Client-side rate limiter
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.firstAttempt > windowMs) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
