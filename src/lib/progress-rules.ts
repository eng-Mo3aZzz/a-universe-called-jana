// Pure progression rules: no React, no storage.
export const STAGE_IDS = ["welcome", "timeline", "stars", "play", "hunt", "gifts", "letters", "finale"] as const;
export type StageId = (typeof STAGE_IDS)[number];

export function isStageId(value: string): value is StageId {
  return (STAGE_IDS as readonly string[]).includes(value);
}

/** A stage opens only when every stage before it is completed. */
export function isStageUnlocked(id: StageId, completed: readonly StageId[]): boolean {
  const index = STAGE_IDS.indexOf(id);
  return STAGE_IDS.slice(0, index).every((prev) => completed.includes(prev));
}

export function nextStage(id: StageId): StageId | null {
  const index = STAGE_IDS.indexOf(id);
  return STAGE_IDS[index + 1] ?? null;
}

/** The first stage that is open but not finished yet (null when everything is done). */
export function currentStage(completed: readonly StageId[]): StageId | null {
  return STAGE_IDS.find((id) => !completed.includes(id) && isStageUnlocked(id, completed)) ?? null;
}

export function completedCount(completed: readonly StageId[]): number {
  return STAGE_IDS.filter((id) => completed.includes(id)).length;
}

/** Gifts open one after another: gift N is available once N gifts were opened. */
export function isGiftUnlocked(index: number, openedCount: number): boolean {
  return index <= openedCount;
}
