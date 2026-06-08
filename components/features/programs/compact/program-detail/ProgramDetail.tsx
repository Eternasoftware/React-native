import React from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { ProgramDetailProps, useProgramDetail } from "./hooks/useProgramDetail";
import { programDetailStyles as styles } from "./styles/programDetail.styles";
import { ProgramDetailNavHeader } from "./components/ProgramDetailNavHeader";
import { ProgramDetailHeader } from "./components/ProgramDetailHeader";
import { ProgramDetailInfo } from "./components/ProgramDetailInfo";
import { ProgramDetailWorkoutList } from "./components/ProgramDetailWorkoutList";

export type { ProgramDetailProps };

const ProgramDetail: React.FC<ProgramDetailProps> = (props) => {
  const { program, close, startWorkout } = props;
  const flow = useProgramDetail(props);

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <ProgramDetailNavHeader
        onBack={close}
        isFavorites={flow.isFavorites}
        onLikePress={flow.handleLikePress}
        animatedBackgroundStyle={flow.animatedBackgroundStyle}
        animatedButtonShadowStyle={flow.animatedButtonShadowStyle}
      />
      <GestureDetector gesture={flow.scrollGesture}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={flow.handleScroll}
          scrollEventThrottle={16}
          ref={flow.scrollViewRef}
          onContentSizeChange={flow.measureElement}
        >
          <View style={styles.container}>
            <ProgramDetailHeader
              program={program}
              title={flow.localization.t(program.title)}
            />
            {!program.isHack && (
              <ProgramDetailInfo duration={flow.duration} level={program.level} />
            )}
            <Text style={styles.description}>{flow.localization.t(program.description)}</Text>
            <ProgramDetailWorkoutList
              program={program}
              listRef={flow.listRef}
              workoutRefs={flow.workoutRefs}
              scrollGesture={flow.scrollGesture}
              onStartWorkout={startWorkout}
            />
          </View>
          <View style={{ height: TAB_BAR_OFFSET }} />
        </Animated.ScrollView>
      </GestureDetector>
    </View>
  );
};

export default ProgramDetail;
