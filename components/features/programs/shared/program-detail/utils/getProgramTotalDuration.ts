import { WorkoutType } from "@/types/program.type";

export function getProgramTotalDuration(workouts: WorkoutType[]): number {
  return workouts.reduce((accum, curr) => accum + curr.duration, 0);
}
