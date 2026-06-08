export type Bonus = {
  bonusPoints?: number;
  bonusInterval?: number;
  bonusMaxValue?: number;
};

export type ChallengeType = {
  challengeStepsDescription: string[];
  description: string;
  bonusDescription?: string;
  duration: number;
  guid: string;
  isBonus: boolean;
  isNumberInput: boolean;
  isTimer: boolean;
  isButton: boolean;
  isTrigger: boolean;
  points: number;
  title: string;
  triggerId: string;
  bonus: Bonus | null;
  prepareTime?: number;
};

export type BadgeType = {
  guid: string;
  title: string;
  image: string;
};

export type WorkoutType = {
  guid: string;
  workoutDescription?: string;
  badge: BadgeType;
  challenges: ChallengeType[];
  creationDate: string;
  description: string;
  duration: number;
  isNewItem: boolean;
  isVisible: boolean;
  isFavorite: boolean;
  points?: number;
  previewSmall: string;
  title: string;
  video: string;
  statusComplete: boolean;
  hideCompleteStatus?: boolean;
  isAvailableForGuest: boolean;
  secondsWatched?: number;
  lastCompletedDate?: string;
  lastWatchedDate?: string;
};

export type ProgramProgress = {
  statusComplete: boolean;
  countWorkouts: number;
  countCompletedWorkouts: number;
};

export type ProgramType = {
  guid: string;
  title: string;
  description: string;
  isVisible: boolean;
  isArchive: boolean;
  isFavorite: boolean;
  energy: number;
  isNewItem: boolean;
  creationDate: string;
  previewSmall: string;
  previewLarge: string;
  level: string;
  workouts: WorkoutType[];
  category: string[];
  badge: BadgeType;
  progress: ProgramProgress;
  isAvailableForGuest: boolean;
  isHack: boolean;
};

export type SaveChallenge = {
  guid: string;
  isNumberInput: boolean;
  isTimer: boolean;
  isTrigger: boolean;
  points: number;
  playTime?: number;
  isBonus: boolean;
  bonusPoints: number;
  finishDate: Date;
};

export type SaveProgramResult = {
  guid: string;
  programGuid: string;
  finishDate: Date;
  workoutPoints: number;
  challenges: SaveChallenge[];
  isFullyWatched?: boolean;
};

export type SaveVideoTime = {
  workoutGuid: string;
  secondsWatched: number;
};

export type FavoritesProgram = {
  guid: string;
  title: string;
  duration: number;
  isFavorite: boolean;
  energy: number;
  isNewItem: boolean;
  previewSmall: string;
  level: string;
  progress: ProgramProgress;
  isAvailableForGuest: boolean;
  isHack: boolean;
};

export type FavoritesWorkout = { programGuid: string } & WorkoutType;

export type Favorites = {
  programs: FavoritesProgram[];
  workouts: FavoritesWorkout[];
};

export type SaveChallengeProps = {
  challenge: ChallengeType;
  points: number;
  bonusPoints?: number;
  time?: number;
};

export type CategoryTab = {
  icon: string;
  label: string;
};
