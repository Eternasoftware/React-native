import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SvgGradientBorder } from "@/components/common/SvgGradientBorder";
import { colors, withAlpha } from "@/assets/styles/constants";

type Props = {
  title: string;
  options: { label: string; value: string }[];
  selectedItem: string;
  isOpen: boolean;
  isHorizontal?: boolean | null;
  onClose: () => void;
  onSelect: (label: string) => void;
};

export const AudioSubsMenu: React.FC<Props> = ({
  title,
  options,
  selectedItem,
  isOpen,
  isHorizontal = false,
  onSelect,
  onClose,
}) => {
  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View
          style={{
            transform: [{ rotate: isHorizontal ? "-90deg" : "0deg" }],
          }}
        >
          <SvgGradientBorder
            radius={15}
            strokeWidth={1}
            colors={[colors.alpha.divider20, colors.alpha.black25]}
            opacities={[1, 0.2]}
          >
            <View style={styles.menuContainer}>
              {Platform.OS === "android" ? (
                <LinearGradient
                  colors={[
                    withAlpha(colors.surface.overlay, 0.6),
                    withAlpha(colors.surface.overlay, 0.2),
                    withAlpha(colors.surface.overlay, 0.6),
                  ]}
                  style={[styles.blur]}
                />
              ) : (
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={[styles.blur, { borderRadius: 15 }]}
                  experimentalBlurMethod={"dimezisBlurView"}
                  blurReductionFactor={5}
                />
              )}
              <Text style={styles.menuTitle}>{title}</Text>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.menuItem, selectedItem === opt.label && styles.menuItemActive]}
                  onPress={() => {
                    onSelect(opt.label);
                  }}
                >
                  <Text style={[styles.menuItemText]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SvgGradientBorder>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 285,
    gap: 8,
  },
  menuItem: { paddingVertical: 7, paddingHorizontal: 16 },
  menuItemText: {
    fontFamily: "Poppins-Medium",
    color: colors.text.body,
    fontSize: 14,
    textAlign: "center",
    textTransform: "uppercase",
  },
  menuItemActive: {
    backgroundColor: colors.alpha.black50,
    borderRadius: 8,
  },
  menuTitle: {
    fontFamily: "Poppins-SemiBoldItalic",
    fontSize: 14,
    color: colors.text.body,
    textTransform: "uppercase",
    textAlign: "center",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    overflow: "hidden",
    zIndex: -2,
  },
});

export default AudioSubsMenu;
