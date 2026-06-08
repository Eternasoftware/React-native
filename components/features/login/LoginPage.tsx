import { View, StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

import AnimatedSlide from "@/components/common/AnimatedSlide";
import LoginScreen from "@/components/features/login/screens/LoginScreen";
import CheckEmailScreen from "@/components/features/login/screens/CheckEmailScreen";
import { useLoginPage } from "@/components/features/login/hooks/useLoginPage";

export default function LoginPage() {
  const { offset, isSend, inputEmail, handleSend, handleBackScreen, setIsSend } = useLoginPage();

  return (
    <View style={styles.container}>
      <AnimatedSlide index={0} offset={offset}>
        <LoginScreen onSend={handleSend} />
      </AnimatedSlide>
      <AnimatedSlide index={1} offset={offset}>
        <CheckEmailScreen
          startChecker={isSend}
          email={inputEmail}
          onResend={() => handleSend(inputEmail)}
          onBack={() => {
            handleBackScreen();
            setIsSend(false);
          }}
        />
      </AnimatedSlide>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.splash,
    flex: 1,
  },
});
