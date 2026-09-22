export type DailyMissionState = {
  checkinCompleted: boolean;
  habitCompleted: boolean;
  protectionCompleted: boolean;
};

export type DailyMissionSummary = DailyMissionState & {
  completedCount: number;
  isComplete: boolean;
};

export function summarizeDailyMissions(state: DailyMissionState): DailyMissionSummary {
  const completedCount = [state.checkinCompleted, state.habitCompleted, state.protectionCompleted].filter(Boolean).length;
  return { ...state, completedCount, isComplete: completedCount === 3 };
}
