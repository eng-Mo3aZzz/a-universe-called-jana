import { describe, expect, it } from "vitest";
import { matchesAny, normalizeArabic } from "@/lib/normalize";
import { currentStage, isGiftUnlocked, isStageUnlocked, nextStage } from "@/lib/progress-rules";
import { elapsedSince } from "@/lib/time";

describe("stage progression", () => {
  it("opens only the first planet at the start", () => {
    expect(isStageUnlocked("welcome", [])).toBe(true);
    expect(isStageUnlocked("timeline", [])).toBe(false);
  });
  it("finishing a planet opens the next one", () => {
    expect(isStageUnlocked("timeline", ["welcome"])).toBe(true);
    expect(nextStage("welcome")).toBe("timeline");
    expect(currentStage(["welcome", "timeline"])).toBe("stars");
  });
  it("the finale stays locked until the letters are done", () => {
    expect(isStageUnlocked("finale", ["welcome", "timeline", "stars", "play", "hunt", "gifts"])).toBe(false);
    expect(isStageUnlocked("finale", ["welcome", "timeline", "stars", "play", "hunt", "gifts", "letters"])).toBe(true);
  });
  it("gifts open one after another", () => {
    expect(isGiftUnlocked(0, 0)).toBe(true);
    expect(isGiftUnlocked(1, 0)).toBe(false);
    expect(isGiftUnlocked(1, 1)).toBe(true);
  });
});

describe("relationship counter", () => {
  it("counts from 23 August 2025", () => {
    expect(elapsedSince("2025-08-23T00:00:00+03:00", new Date("2025-08-24T01:01:01+03:00"))).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });
});

describe("answer matching", () => {
  it("accepts the password with ى instead of ي and extra spaces", () => {
    expect(normalizeArabic(" جوجتى ")).toBe(normalizeArabic("جوجتي"));
  });
  it("accepts Arabic digits for numeric answers", () => {
    expect(matchesAny("٧", ["7"])).toBe(true);
    expect(matchesAny("8", ["7"])).toBe(false);
  });
});
