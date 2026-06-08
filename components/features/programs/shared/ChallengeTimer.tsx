import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Counter from "@/components/animations/Counter";
import CircularProgressSimple from "@/components/animations/CircularProgressSimple";

type ChallengeTimerProps = {
  amount: number;
  extraTime?: number;
  isRun: boolean;
  finish: () => void;
};

const ChallengeTimer: React.FC<ChallengeTimerProps> = ({
  amount = 20,
  extraTime = 0,
  isRun,
  finish = () => {},
}) => {
  const [percentage, setPercentage] = useState(100);
  let interval: any = null;
  useEffect(() => {
    if (isRun) {
      interval = setInterval(() => {
        setPercentage((prev) => {
          if (prev <= -100) {
            clearInterval(interval);
            return prev;
          }
          if (prev > 0) return prev - 100 / amount;
          if (extraTime) return prev - 100 / extraTime;
          else return 0;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRun]);

  return (
    <View style={styles.container}>
      <CircularProgressSimple percentageComplete={percentage} />

      <View style={styles.counterContainer}>
        <Counter isRun={isRun} amount={amount} extraTime={extraTime} finish={finish} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", position: "relative" },
  counterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",
    height: "100%",
    minHeight: "100%",
    width: "100%",
    minWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});

export default ChallengeTimer;
