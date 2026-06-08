import React from "react";
import Animated from "react-native-reanimated";
import NavHeader from "@/components/shared/NavHeader";
import LikeState from "@/components/animations/LikeState";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailNavHeaderProps = {
  onBack: () => void;
  isFavorites: boolean;
  onLikePress: () => void;
  animatedBackgroundStyle: object;
  animatedButtonShadowStyle: object;
};

export const ProgramDetailNavHeader: React.FC<ProgramDetailNavHeaderProps> = ({
  onBack,
  isFavorites,
  onLikePress,
  animatedBackgroundStyle,
  animatedButtonShadowStyle,
}) => (
  <Animated.View style={[styles.navHeader, animatedBackgroundStyle]}>
    <NavHeader
      onBack={onBack}
      text=""
      buttonShadow={true}
      buttonShadowStyle={animatedButtonShadowStyle}
    >
      <LikeState
        value={isFavorites}
        onPress={onLikePress}
        shadow={true}
        buttonShadowStyle={animatedButtonShadowStyle}
      />
    </NavHeader>
  </Animated.View>
);
