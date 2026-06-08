import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  LayoutChangeEvent,
} from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import mainStyles from "@/assets/styles/main";
import DefaultButton from "@/components/common/DefaultButton";
import AttachFile from "@icons/common/attach-file.svg";
import { validateEmailFormat } from "@/utils/functions";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { UserData } from "@/types/users.type";
import * as DocumentPicker from "expo-document-picker";
import { MAX_FILE_SIZE } from "@/utils/constants/common";
import { FileType } from "@/types/common.type";
import PickerImageFile from "@/components/common/PickerImageFile";
import PickerOtherFile from "@/components/common/PickerOtherFile";
import { TextInput as TextInputPaper } from "react-native-paper";
import Animated, { useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import UsersAPI from "@utils/api/users";
import { toastError, toastSuccess, toastInfo } from "@/utils/configs/toast";
import { scheduleOnRN } from "react-native-worklets";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type ContactUsScreenProps = {
  user: UserData;
  onBack: () => void;
};

const ContactUsScreen: React.FC<ContactUsScreenProps> = ({ user, onBack }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);

  const inputPadding = useSharedValue(0);

  const validateEmail = () => {
    setIsValidEmail(validateEmailFormat(email));
  };
  const validateName = () => {
    setIsValidName(!!name);
  };
  const openFilePicker = () => {
    pickFile();
  };

  const pickFile = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        if (file.size > MAX_FILE_SIZE) {
          toastError(`The file cannot be larger than 25 MB.`);

          return;
        }
        inputPadding.value = withTiming(80, {}, () => {
          scheduleOnRN(setSelectedFile, {
            uri: file.uri,
            name: file.name,
            size: file.size,
            type: file.mimeType || "unknown",
          });
        });
      } else {
        console.log("Choose file canceled");
      }
    } catch (error) {
      console.error("Choose file error:", error);
      toastError(`Choose file error: ${error}`);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    inputPadding.value = withDelay(500, withTiming(0));
  };

  const send = async () => {
    if (validateEmailFormat(email) && (message || selectedFile)) {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        } as any);
      }
      formData.append("email", email);
      formData.append("name", name);
      formData.append("message", message);
      try {
        const response = await UsersAPI.sendContactUsForm(formData);

        if (response) {
          setEmail("");
          setName("");
          setMessage("");
          setIsValidEmail(true);
          setIsValidName(true);
          removeFile();
          toastSuccess("The letter has been sent. It will be reviewed shortly.");
        }
      } catch (error: any) {
        toastError("Sorry, something went wrong. Try again later");
      }
    }
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
        text={localization.t(LOCALIZATION_KEYS.TITLE_CONTACT_US)}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isValidEmail ? styles.regularText : styles.errorText]}>
                {localization.t(LOCALIZATION_KEYS.TXT_CONTACT_EMAIL)}
              </Text>
              <TextInput
                autoComplete="email"
                keyboardType="email-address"
                style={mainStyles.inputPrimary}
                placeholder="example@example.com"
                placeholderTextColor={colors.text.onLight}
                accessibilityLabel="Enter your email"
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isValidName ? styles.regularText : styles.errorText]}>
                {localization.t(LOCALIZATION_KEYS.TXT_CONTACT_NAME)}
              </Text>
              <TextInput
                style={mainStyles.inputPrimary}
                placeholder={localization.t(LOCALIZATION_KEYS.TXT_ENTER_NAME)}
                placeholderTextColor={colors.text.onLight}
                accessibilityLabel="Enter your name"
                value={name}
                onChangeText={setName}
                onBlur={validateName}
              />
              {!isValidName && <Text style={styles.validationText}>Name cannot be empty</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isValidName ? styles.regularText : styles.errorText]}>
                {localization.t(LOCALIZATION_KEYS.TXT_MESSAGE)}
              </Text>
              <Animated.View
                style={[styles.messageInputContainer, { paddingBottom: inputPadding }]}
              >
                <TextInputPaper
                  style={[styles.messageInput]}
                  placeholder={localization.t(LOCALIZATION_KEYS.TXT_WRITE_YOUR_QUESTION)}
                  placeholderTextColor={colors.input.placeholderMuted}
                  accessibilityLabel={localization.t(LOCALIZATION_KEYS.TXT_WRITE_YOUR_QUESTION)}
                  onBlur={() => {
                    Keyboard.dismiss();
                  }}
                  selectionColor={colors.state.selection}
                  cursorColor={colors.state.selection}
                  value={message}
                  onChangeText={(val) => {
                    if (val.length >= 3000) {
                      toastInfo("The message cannot be longer than 3000 characters");
                      return;
                    }
                    setMessage(val);
                  }}
                  mode="outlined"
                  contentStyle={{ padding: 16 }}
                  theme={{
                    colors: {
                      primary: colors.text.onLight,
                      background: colors.surface.input,
                    },
                    roundness: 15,
                  }}
                  outlineStyle={{ borderWidth: 0 }}
                  multiline={true}
                  numberOfLines={2}
                />
                <View style={styles.fileInputView}>
                  {selectedFile &&
                    (selectedFile.type.includes("image") ? (
                      <PickerImageFile
                        key={selectedFile.uri}
                        item={selectedFile}
                        onRemove={() => removeFile()}
                      />
                    ) : (
                      <PickerOtherFile
                        key={selectedFile.uri}
                        item={selectedFile}
                        onRemove={() => removeFile()}
                      />
                    ))}
                </View>

                <TouchableOpacity
                  onPress={openFilePicker}
                  activeOpacity={0.7}
                  style={styles.attachIcon}
                >
                  <AttachFile />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          <View style={styles.sendButtonContainer}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_SEND)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              width={244}
              py={8}
              onPress={send}
              btnStyle={styles.sendButton}
              color={colors.text.onLight}
              textStyle={styles.sendButtonText}
              disabled={!(isValidEmail && message)}
            ></DefaultButton>
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
    paddingHorizontal: 36,
    gap: 16,
    alignItems: "center",
  },
  inputs: {
    gap: 16,
    maxWidth: 376,
    width: "100%",
  },
  fileInputView: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    left: 0,
    minHeight: 80,
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
  sendButton: {
    borderColor: "none",
    borderWidth: 0,
  },
  sendButtonContainer: {
    padding: 26,
  },
  sendButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
    textTransform: "capitalize",
  },
  messageInput: {
    backgroundColor: colors.surface.input,
    width: "100%",
    minHeight: 134,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: colors.text.onLight,
    borderWidth: 0,
    outlineColor: "transparent",
    textAlignVertical: "top",
    paddingVertical: Platform.OS !== "web" ? 10 : 0,
    paddingRight: 46,
    maxHeight: 200,
    position: "relative",
  },
  messageInputContainer: {
    borderRadius: 15,
    backgroundColor: colors.surface.input,
    width: "100%",
    minHeight: 134,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: colors.text.onLight,
    borderWidth: 0,
    outlineColor: colors.surface.input,
    textAlignVertical: "top",
  },
  attachIcon: {
    position: "absolute",
    right: 6,
    padding: 10,
  },
  hiddenInput: {
    display: "none",
  },
});

export default ContactUsScreen;
