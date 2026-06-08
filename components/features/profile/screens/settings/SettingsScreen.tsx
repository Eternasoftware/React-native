import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import ArrowIcon from "@icons/common/arrow-right.svg";
import ProfileIcon from "@icons/settings/profile.svg";
import NotoficationIcon from "@icons/settings/notification.svg";
import TermsIcon from "@icons/settings/password.svg";
import LogoutIcon from "@icons/settings/logout.svg";
import DeleteIcon from "@icons/settings/delete.svg";
import { USER_TYPE, UserData } from "@/types/users.type";
import { HOME_SCREENS } from "@/utils/constants/home";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { useRouter } from "expo-router";
import LogoutModal from "@/components/shared/modals/LogoutModal";
import DeleteUserModal from "@/components/shared/modals/DeleteUserModal";
import Constants from "expo-constants";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type SettingsProps = {
  user: UserData;
  onBack: () => void;
  goTo: (screen: HOME_SCREENS) => void;
};

const SettingsScreen: React.FC<SettingsProps> = ({ user, onBack, goTo }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const { logoutUser, removeUser } = useUsersStore(
    useShallow((s) => ({
      logoutUser: s.logoutUser,
      removeUser: s.removeUser,
    }))
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const isCompact = useIsCompactLayout();
  const router = useRouter();

  const settingsBlock = [
    {
      icon: <ProfileIcon />,
      title: localization.t(LOCALIZATION_KEYS.BTN_EDIT_PROFILE),
      to: HOME_SCREENS.EDIT_PROFILE,
    },
    {
      icon: <NotoficationIcon />,
      title: localization.t(LOCALIZATION_KEYS.BTN_NOTIFICATION_SETTINGS),
      to: HOME_SCREENS.NOTIFICATIONS,
    },
  ];
  const additionalBlock = [
    {
      icon: <TermsIcon />,
      title: localization.t(LOCALIZATION_KEYS.BTN_TOS_PP),
      to: HOME_SCREENS.TERMS,
    },
    {
      icon: <TermsIcon />,
      title: localization.t(LOCALIZATION_KEYS.BTN_CONTACT_US),
      to: HOME_SCREENS.CONTACT_US,
    },
  ];
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <LogoutModal
        isVisible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logoutUser();
        }}
      />
      <DeleteUserModal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          await removeUser();
          setShowDeleteModal(false);
          router.push("/onboarding");
        }}
      />
      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_SETTINGS)}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.block}>
            {settingsBlock.map((item) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.item}
                onPress={() => goTo(item.to)}
                key={item.title}
              >
                <View style={styles.icon}>{item.icon}</View>
                <Text style={styles.title}>{item.title}</Text>
                <ArrowIcon style={styles.arrow} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.block}>
            {additionalBlock.map((item) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.item}
                onPress={() => goTo(item.to)}
                key={item.title}
              >
                <View style={styles.icon}>{item.icon}</View>
                <Text style={styles.title}>{item.title}</Text>
                <ArrowIcon style={styles.arrow} />
              </TouchableOpacity>
            ))}
          </View>
          {user.type !== USER_TYPE.GUEST && (
            <View style={styles.block}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.item]}
                onPress={() => {
                  setShowLogoutModal(true);
                }}
              >
                <View style={styles.icon}>
                  <LogoutIcon />
                </View>

                <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.BTN_LOGOUT)}</Text>
                <ArrowIcon style={styles.arrow} />
              </TouchableOpacity>
            </View>
          )}
          {user.type !== USER_TYPE.GUEST && (
            <View style={styles.block}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.item]}
                onPress={() => setShowDeleteModal(true)}
              >
                <View style={styles.icon}>
                  <DeleteIcon />
                </View>

                <Text style={styles.title}>
                  {localization.t(LOCALIZATION_KEYS.BTN_DELETE_ACCOUNT)}
                </Text>
                <ArrowIcon style={styles.arrow} />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
              paddingBottom: 8,
            }}
          >
            <Text style={styles.bottomText}>
              {Constants.expoConfig?.extra?.androidVersionCode}{" "}
              {"v" + Constants.expoConfig?.version}
            </Text>
          </View>
        </View>
        <View style={{ height: TAB_BAR_OFFSET }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 24,
    gap: 16,
    maxWidth: 594,
    width: "100%",
    marginHorizontal: "auto",
  },
  block: {
    backgroundColor: colors.surface.box,
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    color: colors.text.body,
    paddingHorizontal: 10,
    flex: 1,
  },
  icon: {
    padding: 10,
    minWidth: 45,
    minHeight: 45,
  },
  arrow: {
    padding: 4,
  },
  bottomText: {
    color: colors.text.body,
  },
});

export default React.memo(SettingsScreen);
