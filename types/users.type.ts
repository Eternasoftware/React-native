import { Favorites } from "@/types/program.type";

export type Achievement = {
  guid: string;
  title: string;
  image: string;
  category: string;
  dateEarnedAt: string;
  programTitle: string;
  workoutTitle: string;
};

export type NotificationsType = {
  generalNotification: boolean;
  dailyWorkoutReminder: boolean;
  weeklyWorkoutReminder: boolean;
  salesAndPromotion: boolean;
  newBlogPosts: boolean;
};

export enum USER_TYPE {
  GUEST = "guest",
  EMAIL = "email",
}

export type UserCompetition = {
  guid: string;
  title?: string;
  rank?: number;
};

export type UserWorkoutSummary = {
  guid: string;
  title?: string;
  count?: number;
};

export type MonthlyWorkoutStat = {
  month: string;
  count: number;
};

export type UserData = {
  id: string;
  image: string;
  name: string;
  email: string;
  points: number;
  trainingScore: number;
  birthDayAt: string;
  favorites: Favorites | null;
  competitions: UserCompetition[];
  workouts: UserWorkoutSummary[];
  monthlyWorkout: MonthlyWorkoutStat[];
  rank: number;
  achievements: Achievement[];
  notifications: NotificationsType;
  type: USER_TYPE;
  localization: string;
  timeZone: string;
};

export type Goal = {
  key: string;
  text: string;
};

export type SurveyData = {
  age: number;
  goal: Goal[];
  devices: string[];
};

export type UserUpdatePayload = Partial<
  Pick<UserData, "name" | "email" | "birthDayAt" | "localization" | "timeZone">
>;
