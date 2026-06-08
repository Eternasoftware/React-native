import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { ProgramType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import TryProgramCardA from "./TryProgramCardA";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ChevroneRightIcon from "@icons/common/chevron-right.svg";
import { useShallow } from "zustand/react/shallow";

type TryOutProgramsListProps = {
  programs: ProgramType[];
};

const TryOutProgramsList: React.FC<TryOutProgramsListProps> = ({ programs }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const scaleNext = useSharedValue(0);
  const scalePrev = useSharedValue(0);
  const isCompact = useIsCompactLayout();

  useEffect(() => {}, []);

  const navigation = useNavigation<any>();

  const handlePress = (programGuid: string, workoutGuid?: string) => {
    navigation.navigate("programs", { programGuid, workoutGuid });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isCompact) {
      setCurrentIndex(viewableItems[0].index);

      const isShowNext = viewableItems[viewableItems.length - 1].index < programs.length - 1;
      scaleNext.value = withTiming(isShowNext ? 1 : 0, { duration: 300 });

      const isShowPrev = viewableItems[0].index;
      scalePrev.value = withTiming(isShowPrev ? 1 : 0, { duration: 300 });
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const scrollToNextItem = (isNext: boolean) => {
    if (currentIndex !== null && currentIndex < programs.length - 1) {
      let index = isNext ? currentIndex + 1 : currentIndex - 1;
      if (!isNext && currentIndex === 0) index = 0;
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      scalePrev.value = withTiming(0, { duration: 0 });
      scaleNext.value = withTiming(1, { duration: 0 });
      return () => {
        scalePrev.value = 0;
        scaleNext.value = 0;
      };
    }, [])
  );

  const animatedStyleNext = useAnimatedStyle(() => ({
    scale: scaleNext.value,
    opacity: scaleNext.value > 0.55 ? 0.55 : 0,
  }));
  const animatedStylePrev = useAnimatedStyle(() => ({
    scale: scalePrev.value,
    opacity: scalePrev.value > 0.55 ? 0.55 : 0,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {localization.t(LOCALIZATION_KEYS.TITLE_TRY_OTHER_PROGRAMS)}
        </Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          ref={flatListRef}
          data={programs}
          renderItem={({ item }) => (
            <TryProgramCardA
              program={item}
              onPress={() => handlePress(item.guid)}
              key={item.guid}
            />
          )}
          keyExtractor={(item) => item.guid}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        {!isCompact && (
          <>
            <Animated.View style={[styles.navButtonContainer, { right: 16 }, animatedStyleNext]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.nextButton}
                onPress={() => scrollToNextItem(true)}
              >
                <ChevroneRightIcon />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[styles.navButtonContainer, { left: 16, rotate: "180deg" }, animatedStylePrev]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.nextButton}
                onPress={() => scrollToNextItem(false)}
              >
                <ChevroneRightIcon />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  listContainer: {
    position: "relative",
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.body,
    fontSize: 24,
  },
  titleSeeAllText: {
    fontFamily: "Poppins-Medium",
    color: colors.text.body,
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 10,
  },
  titleSeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  list: {
    gap: 16,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  navButtonContainer: {
    opacity: 0.7,
    position: "absolute",
    top: 55,
    zIndex: 3,
  },
  nextButton: {
    backgroundColor: colors.text.inverse,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

export default TryOutProgramsList;
