export class AIFunctionError extends Error {
  constructor(
    message: string,
    public code: "TIMEOUT" | "INVALID_RESPONSE" | "RATE_LIMITED" | "CRASH",
  ) {
    super(message);
    this.name = "AIFunctionError";
  }
}

export class AffiliateTrackingError extends Error {
  constructor(
    message: string,
    public linkId: string,
    public reason: "INVALID_LINK" | "DB_WRITE_FAILED" | "RATE_LIMITED",
  ) {
    super(message);
    this.name = "AffiliateTrackingError";
  }
}

export class MissionError extends Error {
  constructor(
    message: string,
    public missionId: string,
    public reason: "NOT_FOUND" | "ALREADY_COMPLETED" | "XP_CALCULATION_FAILED",
  ) {
    super(message);
    this.name = "MissionError";
  }
}

export class OnboardingError extends Error {
  constructor(
    message: string,
    public reason: "CHAT_FAILED" | "ARCHETYPE_ASSIGNMENT_FAILED" | "TIMEOUT",
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}
