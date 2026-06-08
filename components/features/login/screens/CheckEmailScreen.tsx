import React from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import EmailInvoice from "@icons/common/email-invoice.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import NavHeader from "@/components/shared/NavHeader";
import ExpiredModal from "@/components/shared/modals/ExpiredModal";
import { useCheckEmailScreen } from "@/components/features/login/hooks/useCheckEmailScreen";

export type CheckEmailScreenProps = {
  startChecker: boolean;
  email: string;
  onResend: () => void;
  onBack: () => void;
};

const CheckEmailScreen: React.FC<CheckEmailScreenProps> = ({
  startChecker = false,
  email,
  onResend,
  onBack,
}) => {
  const isCompact = useIsCompactLayout();
  const {
    localization,
    checkText,
    isScrollable,
    handleContentSizeChange,
    handleLayout,
    countDown,
    isResendDisabled,
    showExpiredModal,
    setShowExpiredModal,
    handleResend,
  } = useCheckEmailScreen({ email, startChecker });

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32 }]}>
      <ExpiredModal
        isVisible={showExpiredModal}
        onClose={() => {
          setShowExpiredModal(false);
          onBack();
        }}
      />
      <NavHeader text="" onBack={onBack} />

      <View style={styles.content}>
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 20 }}>
            <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_CHECK_EMAIL)}</Text>
            <Text style={styles.descriptionText}>
              {checkText[0]}
              <Text style={[styles.descriptionText, { color: colors.text.accent }]}>{email}</Text>
              {checkText[1]}
            </Text>
          </View>
          <View style={styles.imgContainer}>
            <EmailInvoice style={styles.icon} />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <DefaultButton
            text={
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                <Text style={styles.btnText}>
                  {localization.t(LOCALIZATION_KEYS.BTN_RESEND_LINK)}
                </Text>{" "}
                <Text style={styles.btnText}>{countDown}</Text>
              </Text>
            }
            bg={colors.action.primary}
            bgActive={colors.surface.card}
            width={244}
            py={8}
            onPress={() => handleResend(onResend)}
            btnStyle={styles.continueButton}
            color={colors.text.onLight}
            textStyle={styles.continueButtonText}
            disabled={isResendDisabled}
          ></DefaultButton>
          <Text style={styles.resendText}>{localization.t(LOCALIZATION_KEYS.TXT_RESEND_LINK)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.splash,
    flex: 1,
    position: "relative",
  },
  content: {
    flexDirection: "column",
    flex: 1,
    maxWidth: 476,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "HelveticaNow-Black",
    fontSize: 24,
    color: colors.text.body,
    textAlign: "center",
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
  },
  resendText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 16,
    color: colors.text.body,
  },
  footer: {
    gap: 20,
    paddingBottom: 70,
  },
  imgContainer: {
    alignItems: "center",
  },
  icon: {
    width: 170,
    height: 209,
  },
  continueButton: {
    marginTop: 42,
    borderColor: "none",
    borderWidth: 0,
  },
  continueButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
    minWidth: 198,
  },
  btnText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default CheckEmailScreen;
