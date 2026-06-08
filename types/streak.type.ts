export type StreakActivity = {
  activeDate: string;
  activityType: string;
  workoutGuid: string;
};
export type StreakMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
export type StreakResponse = {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  activities: StreakActivity[];
  meta: StreakMeta;
};
