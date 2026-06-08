import React, { memo, useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Text, Animated, Platform } from "react-native";
import { colors } from "@/assets/styles/constants";
import TriangleIcon from "@icons/common/triangle-yellow.svg";

type NumberPickerProps = {
  startValue?: number;
  endValue?: number;
  initialIndex?: number;
  onChange: (val: number) => void;
};
type NumberPickerItemProps = {
  item: any;
  index: number;
  scrollX: Animated.Value;
};

const ITEM_WIDTH = 80;

const ListItem: React.FC<NumberPickerItemProps> = memo(({ item, index, scrollX }) => {
  const inputRange = [
    (index - 4) * ITEM_WIDTH,
    (index - 3) * ITEM_WIDTH,
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 0.78, 1, 0.78, 0.5],
    extrapolate: "clamp",
  });

  const color = scrollX.interpolate({
    inputRange,
    outputRange: [
      colors.decorative.stickerGreen,
      colors.decorative.stickerOlive,
      colors.text.onLight,
      colors.decorative.stickerOlive,
      colors.decorative.stickerGreen,
    ],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.item}>
      <Animated.Text style={[styles.age, { color, transform: [{ scale }] }]}>{item}</Animated.Text>
    </View>
  );
});

const NumberPicker: React.FC<NumberPickerProps> = ({
  startValue = 16,
  endValue = 100,
  initialIndex = 12,
  onChange,
}) => {
  const [age, setAge] = useState(startValue);
  const flatListRef = useRef<FlatList>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [scrollStateX, setScrollStateX] = useState(ITEM_WIDTH * initialIndex);

  const numbers: any = ["", ""];
  for (let i = startValue; i <= endValue; i++) {
    if (i === endValue) numbers.push("", "");
    else numbers.push(i);
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    const diff = startX - event.clientX;
    const value = scrollStateX + diff >= 0 ? scrollStateX + diff : 0;
    flatListRef.current?.scrollToOffset({
      offset: value,
      animated: false,
    });
    setScrollStateX(value);
    setStartX(event.clientX);
  };

  const handleMouseUp = (event: MouseEvent) => {
    setIsDragging(false);
    setScrollStateX(Math.round(scrollStateX / ITEM_WIDTH) * ITEM_WIDTH);
  };

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  });

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  useEffect(() => {
    const element = flatListRef.current?.getScrollableNode();
    if (element && Platform.OS === "web") {
      element.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      const element = flatListRef.current?.getScrollableNode();
      if (element && Platform.OS === "web") {
        element.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
      }
    };
  }, [scrollStateX, startX, isDragging]);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / ITEM_WIDTH);
      const centerValue = numbers[index + 2];
      if (centerValue >= 0 && centerValue !== age && centerValue !== "") {
        setAge(centerValue);
        onChange(centerValue);
      }
    });
    return () => scrollX.removeAllListeners();
  }, [scrollX, age]);

  return (
    <View style={styles.container}>
      <Text style={styles.ageTitle}>{age}</Text>
      <TriangleIcon style={styles.triangle} />
      <View style={styles.picker}>
        <View style={[styles.verticalBorder, styles.leftDivider]}></View>
        <View style={[styles.verticalBorder, styles.rightDivider]}></View>

        <Animated.FlatList
          ref={flatListRef}
          data={numbers}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          initialNumToRender={20}
          windowSize={10}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <ListItem item={item} index={index} scrollX={scrollX} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          pagingEnabled={Platform.OS === "web" && !isDragging}
          scrollEventThrottle={16}
          decelerationRate={Platform.OS === "ios" ? 0 : "fast"}
          onScroll={handleScroll}
          snapToInterval={ITEM_WIDTH}
          style={{}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 285,
  },
  picker: {
    backgroundColor: colors.action.primary,
    position: "relative",
  },
  verticalBorder: {
    position: "absolute",
    width: 2,
    height: 115,
    backgroundColor: colors.text.inverse,
    top: -10,
    zIndex: 1,
  },
  leftDivider: {
    left: ITEM_WIDTH * 2,
  },
  rightDivider: {
    right: ITEM_WIDTH * 2,
  },
  triangle: {
    marginTop: 18,
    marginBottom: 30,
    marginHorizontal: "auto",
  },
  item: {
    width: ITEM_WIDTH,
    height: 80,
    justifyContent: "center",
  },
  age: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.onLight,
    textAlign: "center",
    userSelect: "none",
    fontSize: 40,
  },
  ageTitle: {
    fontFamily: "HelveticaNow-ExtBlk",
    color: colors.text.body,
    fontSize: 64,
    textTransform: "capitalize",
    textAlign: "center",
    padding: 16,
    marginTop: 10,
    minHeight: 110,
  },
  list: {
    paddingVertical: 8,
  },
});

export default NumberPicker;
