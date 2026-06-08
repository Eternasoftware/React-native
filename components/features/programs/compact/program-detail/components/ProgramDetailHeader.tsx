import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { ProgramType } from "@/types/program.type";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailHeaderProps = {
  program: ProgramType;
  title: string;
};

export const ProgramDetailHeader: React.FC<ProgramDetailHeaderProps> = ({ program, title }) => (
  <View style={styles.headerContainer}>
    <ImageBackground
      source={{ uri: program.previewLarge }}
      style={styles.image}
      resizeMode="cover"
    >
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
