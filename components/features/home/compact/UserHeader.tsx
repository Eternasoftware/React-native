import { colors } from "@/assets/styles/constants";

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, Keyboard } from "react-native";
import { formatDate } from "@/utils/functions";
import SearchIcon from "@icons/common/search-icon.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { TextInput } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useShallow } from "zustand/react/shallow";

type UserHeaderProps = {
  name: string;
  onCancel: () => void;
  onSearch: (val: string) => void;
  onFocus: () => void;
};

const UserHeader: React.FC<UserHeaderProps> = ({ onCancel, name, onSearch, onFocus }) => {
  const { localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const date = formatDate(new Date());
  const [inputValue, setInputValue] = useState("");
  const width = useSharedValue<number>(screenWidth - 32);
  const offsetHeader = useSharedValue<number>(0);
  const offsetInput = useSharedValue<number>(width.value - 16);
  const route = useRoute();
  const navigation: any = useNavigation();

  const OFFSET_RIGHT = 56;
  const ANIMATION_DURATION = 400;

  const greeting = name
    ? localization.t(LOCALIZATION_KEYS.TITLE_GREETINGS_NAME).replace("{0}", name)
    : localization.t(LOCALIZATION_KEYS.TITLE_GREETINGS);

  useEffect(() => {
    width.value = screenWidth - 32;
    offsetInput.value = width.value - OFFSET_RIGHT;
  }, [width]);
  useEffect(() => {
    onSearch(inputValue);
  }, [inputValue]);

  const styleHeader = useAnimatedStyle(() => ({
    left: withSpring(offsetHeader.value, { damping: 80 }),
    opacity: interpolate(offsetInput.value, [width.value - OFFSET_RIGHT, 0], [1, 0]),
    zIndex: offsetInput.value ? 1 : 0,
  }));

  const styleInput = useAnimatedStyle(() => ({
    left: withSpring(offsetInput.value, { damping: 80 }),
    opacity: interpolate(offsetInput.value, [0, width.value - OFFSET_RIGHT], [1, 0]),
    zIndex: offsetInput.value ? 0 : 1,
  }));

  const handlePress = () => {
    if (offsetHeader.value === 0) {
      offsetInput.value = withTiming(0, { duration: ANIMATION_DURATION });
      offsetHeader.value = withTiming(-width.value + OFFSET_RIGHT, {
        duration: ANIMATION_DURATION,
      });
    } else {
      offsetInput.value = withTiming(width.value - OFFSET_RIGHT, {
        duration: ANIMATION_DURATION,
      });
      offsetHeader.value = withTiming(0, {
        duration: ANIMATION_DURATION,
      });
    }
    onCancel();
    setTimeout(() => setInputValue(""), ANIMATION_DURATION);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e: any) => {
      const index = e.data.state.index;
      const activeRoute = e.data.state.routes[index].name;

      if (activeRoute !== route.name) {
        offsetInput.value = withTiming(width.value - OFFSET_RIGHT, {
          duration: ANIMATION_DURATION,
        });
        offsetHeader.value = withTiming(0, {
          duration: ANIMATION_DURATION,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, route]);

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Animated.View style={[styles.header, styles.boxPosition, styleHeader]}>
          <View style={styles.contentHeader}>
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={styles.date}>{date}</Text>
              <Text style={styles.name}>{greeting}</Text>
            </View>
          </View>
          <Pressable
            onPress={handlePress}
            style={{
              paddingRight: 16,
            }}
          >
            <SearchIcon style={styles.search} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.contentInput, styles.boxPosition, styleInput]}>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChangeText={(val) => {
                setInputValue(val);
              }}
              onBlur={() => {
                Keyboard.dismiss();
              }}
              onPress={() => {
                onFocus();
              }}
              onSubmitEditing={() => {}}
              mode="outlined"
              cursorColor={colors.neutral.grayaaa}
              contentStyle={{ padding: 16 }}
              theme={{
                colors: {
                  primary: colors.neutral.grayaaa,
                  background: "transparent",
                },
                roundness: 45,
              }}
              textColor={colors.text.inverse}
              outlineStyle={styles.outlineStyle}
            />
            <View style={styles.placeholderContainer}>
              {!inputValue && (
                <View style={styles.placeholder}>
                  <SearchIcon style={styles.placeholderSearch} />
                  <Text style={styles.placeholderText} numberOfLines={1} ellipsizeMode="tail">
                    {localization.t(LOCALIZATION_KEYS.TXT_SEARCH_PLACEHOLDER)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              handlePress();
            }}
          >
            <Text style={styles.cancelBtn}>{localization.t(LOCALIZATION_KEYS.BNT_CANCEL)}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.splash,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 104,
    maxHeight: 104,
  },
  contentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 80,
    width: "100%",
    flex: 1,
    minWidth: 200,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  contentInput: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  boxPosition: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  inputContainer: {
    flex: 1,
  },
  date: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    paddingBottom: 4,
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Black",
    fontSize: 20,
  },
  search: {
    width: 24,
    height: 24,
  },
  cancelBtn: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 18,
    color: colors.text.accent,
    padding: 13,
  },
  placeholderContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    backgroundColor: colors.surface.box,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 50,
  },
  placeholder: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    opacity: 0.5,
    zIndex: -1,
    flex: 1,
    minWidth: 0,
    maxWidth: "100%",
  },
  placeholderText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Regular",
    fontSize: 16,
    flexShrink: 1,
    minWidth: 0,
  },
  placeholderSearch: {
    width: 24,
    height: 24,
  },
  outlineStyle: {
    borderWidth: 0,
    borderColor: colors.action.primary,
    padding: 16,
    flex: 1,
  },
});

export default React.memo(UserHeader);
