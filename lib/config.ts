/**
 * Configuration object that validates environment variables at build time.
 * Throws an error if any required variable is missing.
 */
export const config = {
  typingDelay: Number(process.env.NEXT_PUBLIC_TYPING_DELAY),
  pauseDelay: Number(process.env.NEXT_PUBLIC_PAUSE_DELAY),
  deletingDelay: Number(process.env.NEXT_PUBLIC_DELETING_DELAY),
  heroTexts: JSON.parse(process.env.NEXT_PUBLIC_HERO_TEXTS || "{}"),
  githubProfiles: JSON.parse(process.env.NEXT_PUBLIC_GITHUB_PROFILES || "{}"),
} as const;

// Validate required environment variables
if (typeof config.typingDelay !== "number" || isNaN(config.typingDelay)) {
  throw new Error("NEXT_PUBLIC_TYPING_DELAY must be a number");
}

if (typeof config.pauseDelay !== "number" || isNaN(config.pauseDelay)) {
  throw new Error("NEXT_PUBLIC_PAUSE_DELAY must be a number");
}

if (typeof config.deletingDelay !== "number" || isNaN(config.deletingDelay)) {
  throw new Error("NEXT_PUBLIC_DELETING_DELAY must be a number");
}

if (!Array.isArray(config.heroTexts)) {
  throw new Error("NEXT_PUBLIC_HERO_TEXTS must be a valid JSON array");
}

if (!Array.isArray(config.githubProfiles)) {
  throw new Error("NEXT_PUBLIC_GITHUB_PROFILES must be a valid JSON array");
}
