import { AIFunctionError, AffiliateTrackingError, MissionError, OnboardingError } from "./errors";

describe("Named Error Classes", () => {
  it("AIFunctionError stores code correctly", () => {
    const err = new AIFunctionError("timeout", "TIMEOUT");
    expect(err.name).toBe("AIFunctionError");
    expect(err.code).toBe("TIMEOUT");
    expect(err.message).toBe("timeout");
  });

  it("AffiliateTrackingError stores linkId and reason", () => {
    const err = new AffiliateTrackingError("tracking failed", "link-123", "DB_WRITE_FAILED");
    expect(err.linkId).toBe("link-123");
    expect(err.reason).toBe("DB_WRITE_FAILED");
  });

  it("MissionError stores missionId and reason", () => {
    const err = new MissionError("not found", "m-456", "NOT_FOUND");
    expect(err.missionId).toBe("m-456");
    expect(err.reason).toBe("NOT_FOUND");
  });

  it("OnboardingError stores reason", () => {
    const err = new OnboardingError("chat failed", "CHAT_FAILED");
    expect(err.reason).toBe("CHAT_FAILED");
  });
});
