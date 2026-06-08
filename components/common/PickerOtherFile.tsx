import { colors } from "@/assets/styles/constants";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import OtherFileIcon from "@icons/common/other-file.svg";
import { FileType } from "@/types/common.type";
import Animated, { CurvedTransition, ZoomIn, ZoomOut } from "react-native-reanimated";

type PickerImageFileProps = {
  item: FileType;
  onRemove: () => void;
};

const PickerImageFile: React.FC<PickerImageFileProps> = ({ item, onRemove }) => {
  const type = item.type.split("/")[1];
  return (
    <View style={styles.container}>
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut}
        layout={CurvedTransition}
        style={styles.content}
      >
        <View style={styles.imgContainer}>
          <OtherFileIcon style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.type}>
            {type}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={onRemove} style={styles.closeBtnContainer}>
          <View style={styles.closeBtn}>
            <CloseIcon style={styles.closeIcon} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    maxWidth: 259,
    minHeight: 48,
    maxHeight: 48,
    height: 48,
    width: "100%",
    backgroundColor: colors.surface.input,
  },
  content: {
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 259,
    minHeight: 48,
    maxHeight: 48,
    height: 48,
    width: "100%",
    padding: 8,
    backgroundColor: colors.surface.input,
    gap: 10,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  imgContainer: {
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 34,
    maxWidth: 34,
    minHeight: 34,
    maxHeight: 34,
    height: 34,
    width: 34,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    color: colors.text.onLight,
  },
  type: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    color: colors.text.onLight,
    opacity: 0.3,
    textTransform: "uppercase",
  },
  icon: {
    minWidth: 34,
    maxWidth: 34,
    minHeight: 34,
    maxHeight: 34,
    height: 34,
    width: 34,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePreviewWeb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  closeBtnContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 100,
    padding: 5,
  },
  closeBtn: {
    minWidth: 15,
    maxWidth: 15,
    minHeight: 15,
    maxHeight: 15,
    backgroundColor: colors.surface.elevated,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    minWidth: 9,
    maxWidth: 9,
    minHeight: 9,
    maxHeight: 9,
  },
});

export default PickerImageFile;
