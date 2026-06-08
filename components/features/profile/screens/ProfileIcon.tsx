import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Pressable, Image } from "react-native";
import useUsersStore from "@/store/usersStore";
import { useRouter } from "expo-router";
import { HOME_SCREENS } from "@/utils/constants/home";
import { useShallow } from "zustand/react/shallow";
import { colors } from "@/assets/styles/constants";

export type ProfileIcon = {
  iconStyle?: object;
  containerStyle?: object;
  onPress?: () => void;
};

const ProfileIcon: React.FC<ProfileIcon> = ({ iconStyle = {}, containerStyle = {}, onPress }) => {
  const { user } = useUsersStore(
    useShallow((s) => ({
      user: s.user,
    }))
  );

  const router = useRouter();

  const onProfilePress = () => {
    router.push(`/?linkTo=${HOME_SCREENS.PROFILE}`);
  };
  return (
    <Pressable onPress={onPress || onProfilePress} style={[containerStyle]}>
      <Image resizeMode="cover" source={{ uri: user?.image }} style={[styles.img, iconStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 36,
    height: 36,
    borderColor: colors.border.onCard,
    borderRadius: 100,
  },
});

export default ProfileIcon;
