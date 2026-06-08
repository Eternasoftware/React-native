import React from "react";
import { View, ScrollView } from "react-native";
import ProgramDescription from "../ProgramDescription";
import { ProgramDetailProps, useProgramDetailExpanded } from "./hooks/useProgramDetailExpanded";
import { programDetailStyles as styles } from "./styles/programDetail.styles";
import { ProgramDetailHeader } from "./components/ProgramDetailHeader";
import { ProgramDetailWorkoutGrid } from "./components/ProgramDetailWorkoutGrid";

export type { ProgramDetailProps };

const ProgramDetail: React.FC<ProgramDetailProps> = (props) => {
  const { program, close, startWorkout } = props;
  const flow = useProgramDetailExpanded(props);

  return (
    <ScrollView
      scrollEnabled={flow.isScrollable}
      onContentSizeChange={flow.handleContentSizeChange}
      onLayout={flow.handleLayout}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ProgramDetailHeader
          program={program}
          title={flow.localization.t(program.title)}
          headerHeight={flow.isCompact ? 322 : 500}
          isFavorites={flow.isFavorites}
          onBack={close}
          onLikePress={() => flow.setIsFavorites(!flow.isFavorites)}
        />

        <View style={styles.mainBlockContainer}>
          <View style={[styles.mainBlock, { gap: flow.isCompact ? 16 : 40 }]}>
            <View style={styles.description}>
              <ProgramDescription program={program} />
            </View>
            <ProgramDetailWorkoutGrid program={program} onStartWorkout={startWorkout} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProgramDetail;
