import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Keyboard } from "react-native";
import { colors } from "@/assets/styles/constants";
import CheckBoxState from "../animations/CheckBoxState";
import { TextInput } from "react-native-paper";

type CheckItemProps = {
  text: string;
  onChange: () => void;
  value?: boolean;
  style?: object;
  customValue?: boolean;
  onTyping?: (text: string) => void;
};

const CheckItem: React.FC<CheckItemProps> = ({
  text,
  onChange,
  value = false,
  style,
  onTyping = () => {},
  customValue = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(value);
  const animatedHeight = useRef(new Animated.Value(isExpanded && customValue ? 121 : 57)).current;
  const animatedRadius = useRef(new Animated.Value(isExpanded && customValue ? 20 : 96)).current;
  const animatedContentOpacity = useRef(new Animated.Value(customValue && value ? 1 : 0)).current;
  const animatedContentHeight = useRef(new Animated.Value(customValue && value ? 64 : 0)).current;

  const [inputValue, setInputValue] = useState("");
  const [clickEventValue, setClickEventValue] = useState(value);

  const toggleExpansion = () => {
    const finalHeight = !isExpanded && customValue ? 121 : 57;
    const finalTadius = !isExpanded && customValue ? 20 : 96;
    setIsExpanded(!isExpanded);
    Animated.timing(animatedHeight, {
      toValue: finalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedRadius, {
      toValue: finalTadius,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (customValue) {
      Animated.parallel([
        Animated.timing(animatedContentOpacity, {
          toValue: value ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedContentHeight, {
          toValue: value ? 64 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [value, customValue]);
  return (
    <Animated.View
      style={[
        styles.mainContainer,
        style,
        {
          minHeight: animatedHeight,
          borderRadius: animatedRadius,
          borderColor: value ? colors.action.primary : colors.border.onCard,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          setClickEventValue(!clickEventValue);
        }}
        style={styles.container}
      >
        <Text style={[styles.text]}>{text}</Text>
        <View style={styles.checkboxContainer}>
          <CheckBoxState
            clickEvent={clickEventValue}
            value={value}
            onPress={() => {
              onChange();
              if (customValue) {
                toggleExpansion();
              }
            }}
          />
        </View>
      </Pressable>
      {customValue && (
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: animatedContentOpacity,
              maxHeight: animatedContentHeight,
              overflow: "hidden",
            },
          ]}
        >
          <TextInput
            value={inputValue}
            onChangeText={(val) => {
              setInputValue(val);
              onTyping(inputValue);
            }}
            onBlur={() => {
              Keyboard.dismiss();
            }}
            cursorColor={colors.text.inverse}
            mode="outlined"
            contentStyle={{ paddingHorizontal: 8, lineHeight: 30 }}
            theme={{
              colors: {
                primary: colors.text.inverse,
                background: colors.surface.app,
              },
            }}
            textColor={colors.text.inverse}
            dense={true}
            outlineStyle={styles.outlineStyle}
            numberOfLines={1}
            multiline={false}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    overflow: "hidden",
    flex: 1,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: "space-between",
    zIndex: 1,
  },
  text: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    textTransform: "capitalize",
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  checkboxContainer: {
    flexShrink: 0,
    paddingTop: 2,
  },
  iconContainer: {
    paddingVertical: 14,
    paddingLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  contentContainer: {
    overflow: "hidden",
    paddingHorizontal: 24,
    borderWidth: 0,
    marginBottom: 10,
  },
  outlineStyle: {
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderColor: colors.text.inverse,
  },
});

export default CheckItem;
