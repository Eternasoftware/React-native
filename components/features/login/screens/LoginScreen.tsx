import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import mainStyles from "@/assets/styles/main";
import { Link, useRouter } from "expo-router";
import { validateEmailFormat } from "@/utils/functions";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";

import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

export type LoginScreenProps = {
  onSend: (email: string) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onSend }) => {
  const { localization, toggleShowNavBar } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      toggleShowNavBar: s.toggleShowNavBar,
    }))
  );

  const router = useRouter();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = () => {
    const status = validateEmailFormat(email);
    setIsValidEmail(status);
    return status;
  };
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  useEffect(() => {
    toggleShowNavBar(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.loginText}>{localization.t(LOCALIZATION_KEYS.TITLE_LOGIN)}</Text>
              <Text style={styles.welcomeText}>
                {localization.t(LOCALIZATION_KEYS.SUBTITLE_LOGIN)}
              </Text>
              <Text style={styles.descriptionText}>
                {localization.t(LOCALIZATION_KEYS.DESCR_LOGIN)}
              </Text>
            </View>

            <View style={styles.form}>
              <View style={{ gap: 16 }}>
                <View style={styles.inputContainer}>
                  <Text
                    style={[styles.label, isValidEmail ? styles.regularText : styles.errorText]}
                  >
                    {localization.t(LOCALIZATION_KEYS.TXT_EMAIL)}
                  </Text>
                  <TextInput
                    autoComplete="email"
                    keyboardType="email-address"
                    style={mainStyles.inputPrimary}
                    placeholder="example@example.com"
                    placeholderTextColor={colors.text.onLight}
                    accessibilityLabel="Enter your  email"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={validateEmail}
                  />
                  {!isValidEmail && (
                    <Text style={styles.validationText}>
                      {localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_EMAIL)}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.loginButtons}>
                <DefaultButton
                  text={localization.t(LOCALIZATION_KEYS.BTN_SEND_MAGIC_LINK)}
                  bg={colors.action.primary}
                  bgActive={colors.surface.card}
                  width={244}
                  py={8}
                  onPress={() => {
                    const status = validateEmail();
                    if (status) onSend(email);
                  }}
                  btnStyle={styles.loginButton}
                  color={colors.text.onLight}
                  textStyle={styles.loginButtonText}
                ></DefaultButton>
                <DefaultButton
                  text={localization.t(LOCALIZATION_KEYS.BTN_LOGIN_GUEST)}
                  bg={colors.surface.app}
                  bgActive={colors.action.primary}
                  width={244}
                  py={8}
                  onPress={() => {
                    router.push("/");
                  }}
                  textActive={colors.text.onLight}
                  color={colors.text.body}
                  textStyle={styles.loginButtonText}
                ></DefaultButton>
              </View>
            </View>
          </View>

          <View></View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 41,
    minHeight: "100%",
  },
  container: {
    backgroundColor: colors.surface.splash,
    minHeight: "100%",
    flex: 1,
  },
  content: {
    flex: 1,
    maxWidth: 376,
    width: "100%",
    height: "100%",
    marginHorizontal: "auto",
    justifyContent: "space-between",
    paddingBottom: 39,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textTransform: "capitalize",
    paddingTop: 31,
  },
  loginText: {
    fontFamily: "HelveticaNow-ExtBlk",
    color: colors.text.accent,
    fontSize: 20,
    textTransform: "capitalize",
  },
  welcomeText: {
    fontFamily: "HelveticaNow-Black",
    fontSize: 24,
    marginBottom: 28,
    marginTop: 36,
    color: colors.text.body,
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
  },
  form: {
    paddingTop: 48,
    paddingBottom: 69,
  },
  inputContainer: {
    paddingBottom: 4,
  },
  label: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 5,
  },
  validationText: {
    color: colors.state.error,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 8,
  },
  regularText: {
    color: colors.text.body,
  },
  errorText: {
    color: colors.state.error,
  },
  forgotPassword: {
    color: colors.text.body,
    textAlign: "right",
    fontFamily: "HelveticaNow-Regular",
    fontSize: 12,
    textTransform: "capitalize",
    marginTop: 4,
  },
  loginButton: {
    borderColor: "none",
    borderWidth: 0,
  },
  loginButtons: {
    marginTop: 62,
    gap: 10,
  },
  loginButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
  footerText: {
    color: colors.text.body,
    textAlign: "center",
    fontFamily: "HelveticaNow-Regular",
    fontSize: 14,
  },
  signUpText: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.accent,
    fontSize: 14,
  },
});

export default LoginScreen;
