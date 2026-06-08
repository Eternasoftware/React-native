import useSettingsStore from "@/store/settingsStore";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { PROGRAM_CATEGORY } from "@/utils/constants/programs";
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@/assets/styles/constants";

type Category = {
  isActive: boolean;
  icon: any;
  label: string;
};

const CategoryButton: React.FC<Category> = ({ icon, label, isActive }) => {
  const { doHost, localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      doHost: s.doHost,
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [btnTitle, setBtnTitle] = useState<string>(label);
  useEffect(() => {
    if (label === PROGRAM_CATEGORY.SENIORS) {
      setBtnTitle(localization.t(LOCALIZATION_KEYS.TITLE_CATEGORY_SENIORS));
    } else if (label === PROGRAM_CATEGORY.ADULTS) {
      setBtnTitle(localization.t(LOCALIZATION_KEYS.TITLE_CATEGORY_ADULTS));
    } else if (label === PROGRAM_CATEGORY.KIDS) {
      setBtnTitle(localization.t(LOCALIZATION_KEYS.TITLE_CATEGORY_KIDS));
    }
  }, [label]);
  return (
    <View
      style={[
        styles.categoryButton,
        { backgroundColor: isActive ? colors.surface.input : colors.border.onCard },
      ]}
    >
      <View style={[styles.categoryButtonContent, !isCompact && { minWidth: 192 }]}>
        <Image resizeMode="contain" source={{ uri: doHost + icon }} style={styles.categoryIcon} />
        <Text
          style={[
            styles.categoryLabel,
            { color: isActive ? colors.surface.card : colors.surface.input },
          ]}
        >
          {btnTitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    minHeight: 32,
    minWidth: 101,
  },
  categoryButtonContent: {
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 6,
    gap: 8,
    alignItems: "center",
    maxWidth: 192,
    width: "100%",
  },
  categoryIcon: {
    width: 18,
    height: 18,
  },
  categoryLabel: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  active: {
    backgroundColor: colors.surface.card,
    color: "white",
  },
  inactive: {
    backgroundColor: colors.surface.input,
    color: colors.surface.card,
  },
});

export default CategoryButton;
