import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CategoryButton from "./CategoryButton";
import { categoryTabs } from "@/utils/constants/programs";

type Props = {
  activeBtnIndex: number | null;
  style?: object;
  onPress: (category?: string) => void;
};

const CategoryList: React.FC<Props> = ({ activeBtnIndex = 0, style, onPress }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(activeBtnIndex);

  useEffect(() => {
    if (activeBtnIndex !== null) setActiveIndex(activeBtnIndex);
  }, [activeBtnIndex]);
  return (
    <View style={[styles.categoryList, style]}>
      {categoryTabs.map((category, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (index === activeIndex) {
                return;
              } else {
                setActiveIndex(index);
                onPress(categoryTabs[index].label);
              }
            }}
            activeOpacity={1}
            key={index}
          >
            <CategoryButton
              isActive={index === activeIndex}
              icon={category.icon}
              label={category.label}
            ></CategoryButton>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
});

export default CategoryList;
