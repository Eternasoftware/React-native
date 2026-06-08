import React, { useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import NavHeader from "@/components/shared/NavHeader";
import EditIcon from "@icons/common/edit.svg";
import mainStyles from "@/assets/styles/main";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useUsersStore from "@/store/usersStore";
import * as ImagePicker from "expo-image-picker";
import { useShallow } from "zustand/react/shallow";

type FillProfileScreenProps = {
  onBack: () => void;
  onNext: () => void;
};

const FillProfileScreen: React.FC<FillProfileScreenProps> = ({ onBack, onNext }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const { updateUser, uploadProfileImage, user } = useUsersStore(
    useShallow((s) => ({
      updateUser: s.updateUser,
      uploadProfileImage: s.uploadProfileImage,
      user: s.user,
    }))
  );

  const [name, setName] = useState("");
  const fileInputRef: any = useRef(null);
  const [isValidName, setIsValidName] = useState(true);
  const validateName = () => {
    setIsValidName(!!name);
  };
  const isCompact = useIsCompactLayout();

  const openFilePicker = () => {
    if (Platform.OS === "web" && fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (Platform.OS !== "web") pickFile();
  };

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled === false) {
        const uriPaths = result.assets[0].uri.split("/");
        const defaultName = uriPaths[uriPaths.length - 1];
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || defaultName,
          type: result.assets[0].mimeType,
        } as any);
        uploadProfileImage(formData);
      } else {
        console.log("File selected canseled", result);
      }
    } catch (error) {
      console.error("Error while file selected: ", error);
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadProfileImage(formData);
    } else {
      console.log("File did not delected");
    }
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <View style={styles.content}>
        <NavHeader onBack={onBack} text="" />

        <View style={styles.textBlock}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_FILL_PROFILE)}</Text>
          <Text style={styles.descriptionText}>
            {localization.t(LOCALIZATION_KEYS.DESCR_FILL_PROFILE)}
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={64}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profile}>
              <View style={styles.imageContainer}>
                {user && (
                  <Image resizeMode="cover" source={{ uri: user.image }} style={styles.img} />
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.editIcon}
                  onPress={openFilePicker}
                >
                  <EditIcon />
                </TouchableOpacity>
                {Platform.OS === "web" && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={styles.hiddenInput}
                  />
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isValidName ? styles.regularText : styles.errorText]}>
                  {localization.t(LOCALIZATION_KEYS.TXT_USERNAME)}
                </Text>
                <TextInput
                  style={mainStyles.inputPrimary}
                  placeholder={localization.t(LOCALIZATION_KEYS.TXT_ENTER_NAME)}
                  placeholderTextColor={colors.text.onLight}
                  accessibilityLabel="Enter your name"
                  value={name}
                  onChangeText={setName}
                  onBlur={() => {
                    validateName();
                    Keyboard.dismiss();
                  }}
                />

                {!isValidName && <Text style={styles.validationText}>Name cannot be empty</Text>}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
            bg={colors.surface.app}
            bgActive={colors.action.primary}
            width={155}
            py={8}
            onPress={async () => {
              await updateUser({ name });
              onNext();
            }}
            textActive={colors.text.onLight}
            btnStyle={styles.button}
            color={colors.text.body}
            textStyle={styles.buttonText}
            disabled={!name}
          ></DefaultButton>
          <View style={{ height: 57, width: 10 }}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.surface.splash,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 35,
  },
  content: {
    flex: 1,
  },
  profile: {
    width: "100%",
    maxWidth: 476,
  },
  imageContainer: {
    alignSelf: "flex-start",
    marginHorizontal: "auto",
    position: "relative",
    marginBottom: 28,
  },
  img: {
    width: 95,
    height: 95,
    borderColor: colors.border.subtle,
    borderWidth: 1,
    borderRadius: 100,
  },
  inputContainer: {
    paddingBottom: 4,
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
  editIcon: {
    position: "absolute",
    padding: 10,
    bottom: -10,
    right: -10,
  },
  textBlock: {
    paddingTop: 24,
    marginBottom: 32,
    gap: 26,
    alignItems: "center",
    paddingHorizontal: 35,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.body,
    fontSize: 24,
    textTransform: "capitalize",
    textAlign: "center",
    maxWidth: 476,
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
    maxWidth: 476,
  },
  button: {
    marginTop: 25,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
  hiddenInput: {
    display: "none",
  },
});

export default FillProfileScreen;
