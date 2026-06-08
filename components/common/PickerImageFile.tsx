import { colors } from "@/assets/styles/constants";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import { FileType } from "@/types/common.type";
import Animated, { CurvedTransition, ZoomIn, ZoomOut } from "react-native-reanimated";

type PickerImageFileProps = {
  item: FileType;
  onRemove: () => void;
};

const PickerImageFile: React.FC<PickerImageFileProps> = ({ item, onRemove }) => {
  return (
    <View style={styles.container}>
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut}
        layout={CurvedTransition}
        style={styles.content}
      >
        <View style={styles.imgContainer}>
          {Platform.OS === "web" ? (
            <img src={item.uri} alt="Picture" style={styles.imagePreviewWeb} />
          ) : (
            <Image source={{ uri: item.uri }} style={styles.imagePreview} resizeMode="cover" />
          )}
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
    minWidth: 48,
    maxWidth: 48,
    minHeight: 48,
    maxHeight: 48,
    height: 48,
    width: 48,
    backgroundColor: colors.surface.input,
  },
  content: {
    backgroundColor: colors.surface.input,
    borderWidth: 1,
    borderColor: colors.border.onCard,
    borderRadius: 8,
    minWidth: 48,
    maxWidth: 48,
    minHeight: 48,
    maxHeight: 48,
    height: 48,
    width: 48,
  },
  imgContainer: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    height: "100%",
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
