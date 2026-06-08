import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import { WorkoutType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import SearchWorkoutItem from "@/components/features/home/shared/SearchWorkoutItem";
import "@assets/styles/theme.css";
import "@assets/styles/style.css";
import Animated, { CurvedTransition } from "react-native-reanimated";

type SearchResultListProps = {
  workouts: WorkoutType[];
  searchString: string;
  containerStyles?: object;
  onPress: (workoutGuid: string) => void;
};

const SearchResultList: React.FC<SearchResultListProps> = ({
  workouts,
  searchString,
  containerStyles,
  onPress,
}) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, containerStyles]}>
      {workouts.length !== 0 && (
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            zIndex: 2,
            minWidth: "100%",
          }}
        >
          <View style={[styles.list]}>
            {workouts.map((workout, index) => {
              return (
                <Animated.View
                  layout={CurvedTransition.duration(100)}
                  style={{
                    flex: 1,
                    maxHeight: 110,
                    minHeight: 110,
                    minWidth: 390,
                    maxWidth: 390,
                  }}
                  key={workout.guid}
                >
                  <SearchWorkoutItem
                    workout={workout}
                    searchString={searchString}
                    onPress={() => onPress(workout.guid)}
                    containerStyle={{
                      backgroundColor: colors.surface.elevated,
                      borderBottomWidth: index < workouts.length - 1 ? 1 : 0,
                      maxWidth: 390,
                      width: 390,
                    }}
                    key={workout.guid}
                  />
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 411,
    minWidth: 411,
    right: 0,
    backgroundColor: colors.surface.splash,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: "hidden",
    overflowClipBox: "padding-box",
  },
  list: {
    borderTopColor: colors.border.onCard,
    minWidth: 411,
    paddingRight: 10,
  },
});

export default SearchResultList;
