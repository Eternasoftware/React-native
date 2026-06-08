import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import { WorkoutType } from "@/types/program.type";
import SearchWorkoutItem from "./SearchWorkoutItem";
import { colors } from "@/assets/styles/constants";
import SearchIcon from "@icons/common/search-icon.svg";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import Animated, { CurvedTransition } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

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
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

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
      {workouts.length !== 0 ? (
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ zIndex: 2, minWidth: "100%" }}
        >
          <View style={styles.list}>
            {workouts.map((workout) => {
              return (
                <Animated.View
                  layout={CurvedTransition.duration(100)}
                  style={{
                    flex: 1,
                    maxHeight: 110,
                    minHeight: 110,
                    minWidth: "100%",
                  }}
                  key={workout.guid}
                >
                  <SearchWorkoutItem
                    workout={workout}
                    searchString={searchString}
                    onPress={() => onPress(workout.guid)}
                    containerStyle={{
                      backgroundColor: colors.surface.splash,
                    }}
                    key={workout.guid}
                  />
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <SearchIcon style={styles.search} />
          <Text style={styles.emptyText}>{localization.t(LOCALIZATION_KEYS.TXT_NO_RESULTS)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: colors.surface.splash,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: colors.border.onCard,
    minHeight: "100%",
    minWidth: "100%",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    gap: 16,
    margin: "auto",
    alignSelf: "center",
  },
  search: {
    minWidth: 55,
    maxWidth: 55,
    minHeight: 55,
    maxHeight: 55,
  },
  emptyText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 18,
  },
});

export default SearchResultList;
