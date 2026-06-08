import React from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowBack from "@icons/common/arrow-back.svg";
import { colors } from "@/assets/styles/constants";
import Animated from "react-native-reanimated";
import useSettingsStore from "@/store/settingsStore";
import TextTicker from "react-native-text-ticker";
import { useShallow } from "zustand/react/shallow";

type NavHeaderProps = {
  text: string;
  onBack: () => void;
  showBack?: boolean;
  buttonShadow?: boolean;
  buttonShadowStyle?: object;
  isRuningLine?: boolean;
  children?: React.ReactNode;
};

const NavHeader: React.FC<NavHeaderProps> = ({
  text,
  onBack,
  showBack = true,
  buttonShadow = false,
  buttonShadowStyle,
  isRuningLine = false,
  children,
}) => {
  const isCompact = useIsCompactLayout();
  const { screenWidth } = useSettingsStore(
    useShallow((s) => ({
      screenWidth: s.screenWidth,
    }))
  );

  return (
    <View style={[styles.container, !isCompact && styles.containerWeb]}>
      {showBack && (
        <TouchableOpacity
          style={[{ paddingLeft: isCompact ? 16 : 24, marginRight: 24 }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[styles.iconContainer, buttonShadow && styles.shadow, buttonShadowStyle]}
          >
            <ArrowBack style={styles.icon} />
          </Animated.View>
        </TouchableOpacity>
      )}

      {isRuningLine ? (
        <View style={[styles.header]}>
          <TextTicker
            numberOfLines={1}
            style={[styles.text, { width: screenWidth - 74 }]}
            duration={5000}
            loop
            bounce
            scroll={false}
            repeatSpacer={30}
            marqueeDelay={1000}
          >
            {text}
          </TextTicker>
        </View>
      ) : (
        <View style={[styles.header, { paddingRight: showBack ? 40 : 0 }]}>
          <Text style={[styles.text, { width: "100%" }]}>{text}</Text>
        </View>
      )}
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    paddingVertical: 14,
    minHeight: 80,
    width: "100%",
  },
  containerWeb: {
    paddingRight: 24,
    minHeight: 106,
  },
  header: {
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
  },
  shadow: {
    borderRadius: 100,
    backgroundColor: colors.alpha.black40,
  },
  text: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Black",
    fontSize: 24,
    textTransform: "uppercase",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default NavHeader;
