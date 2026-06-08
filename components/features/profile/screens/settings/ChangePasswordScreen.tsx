import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TextInput, LayoutChangeEvent } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import mainStyles from "@/assets/styles/main";
import DefaultButton from "@/components/common/DefaultButton";
import EyeOpenClose from "@/components/animations/EyeOpenClose";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type ChangePasswordProps = {
  onBack: () => void;
};

const ChangePasswordScreen: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isValidCurrentPassword, setIsValidCurrentPassword] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [currentPasswordSecure, setCurrentPasswordSecure] = useState(true);
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);
  const validateCurrentPassword = () => {
    const hasMinLength = currentPassword.length >= 6;
    const hasUpperCase = /[A-Z]/.test(currentPassword);
    if (!hasMinLength) {
      setCurrentPasswordError(localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_PASSWORD_LENGTH));
    } else if (!hasUpperCase) {
      setCurrentPasswordError(localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_PASSWORD_CAPITAL));
    }
    setIsValidCurrentPassword(hasMinLength && hasUpperCase);
  };

  const validatePassword = () => {
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasMinLength) {
      setPasswordError(localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_PASSWORD_LENGTH));
    } else if (!hasUpperCase) {
      setPasswordError(localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_PASSWORD_CAPITAL));
    }
    if (!isValidConfirmPassword) validateConfirmPassword();
    setIsValidPassword(hasMinLength && hasUpperCase);
  };

  const validateConfirmPassword = () => {
    setIsValidConfirmPassword(password === confirmPassword);
  };

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_PASSWORD_SETTINGS)}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={{ paddingBottom: 46 }}>
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  isValidCurrentPassword ? styles.regularText : styles.errorText,
                ]}
              >
                {localization.t(LOCALIZATION_KEYS.TXT_CURRENT_PASSWORD)}
              </Text>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={mainStyles.inputPrimary}
                  placeholder="*************"
                  placeholderTextColor={colors.text.onLight}
                  secureTextEntry={currentPasswordSecure}
                  accessibilityLabel="Enter your password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  onBlur={validateCurrentPassword}
                />
                <EyeOpenClose
                  value={currentPasswordSecure}
                  onPress={() => setCurrentPasswordSecure(!currentPasswordSecure)}
                />
              </View>

              {!isValidCurrentPassword && (
                <Text style={styles.validationText}>{currentPasswordError}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isValidPassword ? styles.regularText : styles.errorText]}>
              {localization.t(LOCALIZATION_KEYS.TXT_NEW_PASSWORD)}
            </Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={mainStyles.inputPrimary}
                placeholder="*************"
                placeholderTextColor={colors.text.onLight}
                secureTextEntry={passwordSecure}
                accessibilityLabel="Enter your password"
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
              />
              <EyeOpenClose
                value={passwordSecure}
                onPress={() => setPasswordSecure(!passwordSecure)}
              />
            </View>
            {!isValidPassword && <Text style={styles.validationText}>{passwordError}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, isValidConfirmPassword ? styles.regularText : styles.errorText]}
            >
              {localization.t(LOCALIZATION_KEYS.TXT_CONFIRM_NEW_PASSWORD)}
            </Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={mainStyles.inputPrimary}
                placeholder="*************"
                placeholderTextColor={colors.text.onLight}
                secureTextEntry={confirmPasswordSecure}
                accessibilityLabel="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={validateConfirmPassword}
              />
              <EyeOpenClose
                value={confirmPasswordSecure}
                onPress={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
              />
            </View>
            {!isValidConfirmPassword && (
              <Text style={styles.validationText}>Confirmation password is incorrect</Text>
            )}
          </View>
          <View style={styles.updateButtonContainer}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_CHANGE_PASSWORD)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              width={244}
              py={8}
              onPress={() => {}}
              btnStyle={styles.updateButton}
              color={colors.text.onLight}
              textStyle={styles.updateButtonText}
            ></DefaultButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 36,
    gap: 16,
    maxWidth: 448,
    width: "100%",
    marginHorizontal: "auto",
  },
  imageContainer: {
    alignSelf: "flex-start",
    marginHorizontal: "auto",
    position: "relative",
  },
  img: {
    width: 125,
    height: 125,
    borderColor: colors.border.subtle,
    borderWidth: 1,
    borderRadius: 100,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    color: colors.text.body,
    paddingHorizontal: 10,
    flex: 1,
  },
  inputContainer: {
    paddingBottom: 4,
  },
  inputFieldContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 6,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 8,
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
  updateButton: {
    borderColor: "none",
    borderWidth: 0,
  },
  updateButtonContainer: {
    padding: 26,
  },
  updateButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
});

export default ChangePasswordScreen;
