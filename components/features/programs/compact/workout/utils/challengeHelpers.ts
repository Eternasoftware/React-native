import { Bonus, SaveChallenge, SaveChallengeProps } from "@/types/program.type";

export function calculateTimerBonusPoints(
  time: number,
  duration: number,
  bonus?: Bonus | null
): number {
  if (!bonus?.bonusPoints || !bonus?.bonusInterval) return 0;

  const bonusTime = time - duration;
  let currBonusPoints = Math.floor(bonusTime / bonus.bonusInterval) * bonus.bonusPoints;
  if (bonus.bonusMaxValue && currBonusPoints > bonus.bonusMaxValue) {
    currBonusPoints = bonus.bonusMaxValue;
  }
  return currBonusPoints;
}

export function calculatePickerBonusPoints(
  value: number,
  bonusPoints?: number,
  bonusMaxValue?: number
): number {
  let currBonusPoints = bonusPoints ? value * bonusPoints : 0;
  if (bonusMaxValue && currBonusPoints > bonusMaxValue) {
    currBonusPoints = bonusMaxValue;
  }
  return currBonusPoints;
}

export function buildSaveChallenge(saveData: SaveChallengeProps): SaveChallenge {
  const { challenge, points, bonusPoints, time } = saveData;
  const data: SaveChallenge = {
    guid: saveData.challenge.guid,
    isNumberInput: challenge.isNumberInput,
    isTimer: challenge.isTimer,
    isTrigger: challenge.isTrigger,
    points: points || 0,
    isBonus: challenge.isBonus,
    bonusPoints: bonusPoints || 0,
    finishDate: new Date(),
  };
  if (time !== undefined) data.playTime = time;
  return data;
}
