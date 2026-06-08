import { useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { useShallow } from "zustand/react/shallow";

export function useLoginPage() {
  const {
    isOnline,
    setShowConnectionError,
    showNavigation,
    toggleShowNavBar,
    toggleShowNavigation,
  } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      setShowConnectionError: s.setShowConnectionError,
      showNavigation: s.showNavigation,
      toggleShowNavBar: s.toggleShowNavBar,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const { sendMagicLink } = useUsersStore(
    useShallow((s) => ({
      sendMagicLink: s.sendMagicLink,
    }))
  );

  const [isSend, setIsSend] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const offset = useSharedValue(0);

  const handleNextScreen = () => {
    offset.value = 1;
  };

  const handleBackScreen = () => {
    offset.value = 0;
  };

  const handleSend = (email: string) => {
    if (isOnline) {
      setInputEmail(email);
      sendMagicLink(email);
      setIsSend(true);
      handleNextScreen();
    } else {
      setShowConnectionError(true);
    }
  };

  useEffect(() => {
    toggleShowNavBar(false);
    if (showNavigation) toggleShowNavigation(false);
  }, []);

  return {
    offset,
    isSend,
    inputEmail,
    handleSend,
    handleBackScreen,
    setIsSend,
  };
}
