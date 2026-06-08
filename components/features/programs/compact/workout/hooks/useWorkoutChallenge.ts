import { useState } from "react";
import {
  SaveChallengeProps,
  SaveProgramResult,
  WorkoutType,
} from "@/types/program.type";
import { logEvent } from "@/utils/configs/analytics";
import { FirebaseEvents } from "@/utils/constants/firebase-events";
import {
  buildSaveChallenge,
  calculatePickerBonusPoints,
  calculateTimerBonusPoints,
} from "../utils/challengeHelpers";

type UseWorkoutChallengeParams = {
  workout: WorkoutType;
  programGuid: string;
  programName: string;
  isOnline: boolean;
  isVideoFullyWatched: boolean;
  setShowConnectionError: (show: boolean) => void;
  onComplete: (data: SaveProgramResult) => Promise<void>;
  fetchUser: () => void;
  back: () => void;
  handleNextScreen: (index: number) => void;
  handleBackScreen: (index: number) => void;
};

export function useWorkoutChallenge({
  workout,
  programGuid,
  programName,
  isOnline,
  isVideoFullyWatched,
  setShowConnectionError,
  onComplete,
  fetchUser,
  back,
  handleNextScreen,
  handleBackScreen,
}: UseWorkoutChallengeParams) {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeTime, setChallengeTime] = useState(0);
  const [points, setPoints] = useState(workout.points ? workout.points : 0);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [dataToSave, setDataToSave] = useState<SaveProgramResult>({
    guid: workout.guid,
    programGuid,
    finishDate: new Date(),
    workoutPoints: workout.points || 0,
    challenges: [],
  });

  const prepareChallengeToSave = (saveData: SaveChallengeProps) => {
    const { challenge } = saveData;
    dataToSave.challenges[challengeIndex] = buildSaveChallenge(saveData);
    logEvent(FirebaseEvents.COMPLETE_CHALLENGE, {
      program_guid: programGuid,
      program_title: programName,
      workout_guid: workout.guid,
      workout_title: workout.title,
      challenge_guid: challenge.guid,
      challenge_title: challenge.title,
    });
    setDataToSave(dataToSave);
  };

  const stop = (time: number) => {
    setChallengeTime(challengeTime + time);
    const { duration, isBonus, bonus, points: regularPoints } = workout.challenges[challengeIndex];
    if (time < duration) {
      if (!isBonus) setIsInterrupted(true);
      handleNextScreen(4);
    } else {
      const currBonusPoints = calculateTimerBonusPoints(time, duration, bonus);

      prepareChallengeToSave({
        challenge: workout.challenges[challengeIndex],
        points: regularPoints,
        time,
        bonusPoints: currBonusPoints,
      });

      setPoints(points + regularPoints + currBonusPoints);
      if (challengeIndex < workout.challenges.length - 1) {
        setChallengeIndex(challengeIndex + 1);
        handleBackScreen(3);
      } else {
        handleNextScreen(4);
      }
    }
  };

  const retryWorkout = () => {
    setIsInterrupted(false);
    handleBackScreen(3);
    setPoints(0);
    setChallengeIndex(0);
    setChallengeTime(0);
    setDataToSave((prev) => ({
      ...prev,
      challenges: [],
      workoutPoints: workout.points || 0,
    }));
  };

  const startChallenge = () => {
    handleNextScreen(3);
    logEvent(FirebaseEvents.START_CHALLENGE, {
      program_guid: programGuid,
      program_title: programName,
      workout_guid: workout.guid,
      workout_title: workout.title,
      challenge_guid: workout.challenges[challengeIndex].guid,
      challenge_title: workout.challenges[challengeIndex].title,
    });
  };

  const handlePickerSkip = () => {
    handleNextScreen(4);
    setPoints(points + workout.challenges[challengeIndex].points);
    prepareChallengeToSave({
      challenge: workout.challenges[challengeIndex],
      points: workout.challenges[challengeIndex].points,
    });
  };

  const handlePickerNext = (value: number) => {
    const { bonus, points: challengePoints } = workout.challenges[challengeIndex];
    const currBonusPoints = calculatePickerBonusPoints(
      value,
      bonus?.bonusPoints,
      bonus?.bonusMaxValue
    );

    prepareChallengeToSave({
      challenge: workout.challenges[challengeIndex],
      points: challengePoints,
      bonusPoints: currBonusPoints,
    });
    setPoints(points + currBonusPoints + challengePoints);

    if (challengeIndex < workout.challenges.length - 1) {
      handleBackScreen(3);
      setChallengeIndex(challengeIndex + 1);
    } else {
      handleNextScreen(4);
    }
  };

  const handleButtonSkip = () => {
    setPoints(points + workout.challenges[challengeIndex].points);
    prepareChallengeToSave({
      challenge: workout.challenges[challengeIndex],
      points: workout.challenges[challengeIndex].points,
    });
    handleNextScreen(4);
  };

  const handleButtonNext = () => {
    const bonusPoints = workout.challenges[challengeIndex].bonus?.bonusPoints;
    setPoints(points + workout.challenges[challengeIndex].points + (bonusPoints || 0));
    prepareChallengeToSave({
      challenge: workout.challenges[challengeIndex],
      points: workout.challenges[challengeIndex].points,
      bonusPoints,
    });
    if (challengeIndex < workout.challenges.length - 1) {
      handleBackScreen(3);
      setChallengeIndex(challengeIndex + 1);
    } else {
      handleNextScreen(4);
    }
  };

  const handleResultNext = async () => {
    if (isInterrupted) {
      back();
      return;
    }
    if (challengeIndex + 1 === workout.challenges.length) {
      if (isOnline) {
        handleNextScreen(5);
        dataToSave.isFullyWatched = isVideoFullyWatched;
        await onComplete(dataToSave);
        fetchUser();
      } else {
        setShowConnectionError(true);
      }
    } else {
      handleBackScreen(3);
      setChallengeIndex(challengeIndex + 1);
    }
  };

  const completeWorkoutWithoutChallenges = () => {
    dataToSave.isFullyWatched = isVideoFullyWatched;
    onComplete(dataToSave);
    fetchUser();
  };

  return {
    challengeIndex,
    challengeTime,
    points,
    isInterrupted,
    stop,
    retryWorkout,
    startChallenge,
    handlePickerSkip,
    handlePickerNext,
    handleButtonSkip,
    handleButtonNext,
    handleResultNext,
    completeWorkoutWithoutChallenges,
  };
}
