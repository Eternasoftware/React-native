import React, { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import ChevronDownIcon from "@icons/common/chevrone-down.svg";
import { colors } from "@/assets/styles/constants";

type ExpandableTextProps = {
  title: string;
  content: string;
};
const ExpandableText: React.FC<ExpandableTextProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const toggleExpansion = () => {
    const finalHeight = isExpanded ? 0 : contentHeight;
    setIsExpanded(!isExpanded);

    Animated.timing(animatedHeight, {
      toValue: finalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.titleContainer} onPress={toggleExpansion}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <ChevronDownIcon />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.hiddenContentContainer} onLayout={onContentLayout}>
        <Text style={styles.content}>{content}</Text>
      </View>
      <Animated.View style={[styles.contentContainer, { height: animatedHeight }]}>
        <Text style={styles.content}>{content}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: colors.surface.splash,
    overflow: "hidden",
    minHeight: 77,
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    zIndex: 1,
    minHeight: 77,
    maxWidth: "100%",
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    color: colors.text.accent,
    alignSelf: "center",
    paddingRight: 10,
  },
  contentContainer: {
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  content: {
    fontSize: 14,
    color: colors.text.body,
    paddingBottom: 24,
  },
  hiddenContentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
});

export default ExpandableText;
