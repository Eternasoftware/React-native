import React from "react";
import { View, Text, ImageBackground } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import LikeState from "@/components/animations/LikeState";
import { ProgramType } from "@/types/program.type";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailHeaderProps = {
  program: ProgramType;
  title: string;
  headerHeight: number;
  isFavorites: boolean;
  onBack: () => void;
  onLikePress: () => void;
};

export const ProgramDetailHeader: React.FC<ProgramDetailHeaderProps> = ({
  program,
  title,
  headerHeight,
  isFavorites,
  onBack,
  onLikePress,
}) => (
  <View style={[styles.headerContainer, { height: headerHeight }]}>
    <ImageBackground
      source={{ uri: program.previewLarge }}
      style={styles.image}
      resizeMode="cover"
    >
      <NavHeader onBack={onBack} text="" buttonShadow={true}>
        <LikeState value={isFavorites} onPress={onLikePress} shadow={true} />
      </NavHeader>
      <View style={styles.header}>
        {program.isNewItem && (
          <View style={styles.newBaner}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </ImageBackground>
  </View>
);
