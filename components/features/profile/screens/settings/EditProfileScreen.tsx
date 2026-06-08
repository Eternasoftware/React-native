import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  Platform,
  LayoutChangeEvent,
} from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import EditIcon from "@icons/common/edit.svg";
import mainStyles from "@/assets/styles/main";
import { validateEmailFormat, formatDateWithDivider } from "@/utils/functions";
import DefaultButton from "@/components/common/DefaultButton";
import CalendarWeb from "@/components/common/CalendarWeb";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { toastSuccess } from "@/utils/configs/toast";
import * as ImagePicker from "expo-image-picker";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type EditProfilerops = {
  onBack: () => void;
};

const EditProfileScreen: React.FC<EditProfilerops> = ({ onBack }) => {
  const { isOnline, localization, setShowConnectionError } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      localization: s.localization,
      setShowConnectionError: s.setShowConnectionError,
    }))
  );

  const { updateUser, uploadProfileImage, user } = useUsersStore(
    useShallow((s) => ({
      updateUser: s.updateUser,
      uploadProfileImage: s.uploadProfileImage,
      user: s.user,
    }))
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const [birthDayAt, setBirthDayAt] = useState<Date | null>(null);
  const fileInputRef: any = useRef(null);
  const isCompact = useIsCompactLayout();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [date, setDate] = useState(user?.birthDayAt ? formatDateWithDivider(user.birthDayAt) : "");
  const [isValidName, setIsValidName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidBirthDayAt, setIsValidBirthDayAt] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const validateEmail = () => {
    setIsValidEmail(validateEmailFormat(email));
  };
  const validateName = () => {
    setIsValidName(!!name);
  };

  const checkDateRahge = (date: Date) => {
    const handredAgo = +new Date().getFullYear() - 100;
    return +date.getFullYear() > handredAgo && date < new Date();
  };

  const validateBirthDayAt = () => {
    if (birthDayAt) {
      setIsValidBirthDayAt(checkDateRahge(birthDayAt));
    }
  };

  const handleDateChange = (date: Date) => {
    setBirthDayAt(date);
    validateBirthDayAt();
    setOpenCalendar(false);
  };

  const handleUpdate = async () => {
    if (!isOnline) {
      setShowConnectionError(true);
      return;
    }
    validateName();
    validateEmail();
    validateBirthDayAt();
    const dataToUpdate: any = {};
    if (name && name !== user?.name) dataToUpdate.name = name;
    if (email && email !== user?.email && validateEmailFormat(email)) dataToUpdate.email = email;
    if (
      birthDayAt &&
      user?.birthDayAt &&
      +birthDayAt !== +new Date(user.birthDayAt) &&
      checkDateRahge(birthDayAt)
    )
      dataToUpdate.birthDayAt = birthDayAt;
    if (Object.keys(dataToUpdate).length) {
      await updateUser(dataToUpdate);
      toastSuccess("Data has been saved.");
    }
  };

  const openFilePicker = () => {
    if (!isOnline) {
      setShowConnectionError(true);
      return;
    }
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

  useEffect(() => {
    if (birthDayAt) setDate(formatDateWithDivider(birthDayAt));
  }, [birthDayAt]);

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
        text={localization.t(LOCALIZATION_KEYS.TITLE_EDIT_PROFILE).toUpperCase()}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image resizeMode="cover" source={{ uri: user?.image }} style={styles.img} />
            <TouchableOpacity activeOpacity={0.7} style={styles.editIcon} onPress={openFilePicker}>
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
              {localization.t(LOCALIZATION_KEYS.TXT_FULL_NAME)}
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
            {!isValidName && (
              <Text style={styles.validationText}>
                {localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_EMPTY_NAME)}
              </Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isValidEmail ? styles.regularText : styles.errorText]}>
              {localization.t(LOCALIZATION_KEYS.TXT_EMAIL)}
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
            <Text style={[styles.label, isValidBirthDayAt ? styles.regularText : styles.errorText]}>
              {localization.t(LOCALIZATION_KEYS.TXT_BIRTH_DATE)}
            </Text>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "ios") setOpenCalendar(true);
              }}
            >
              <TextInput
                style={mainStyles.inputPrimary}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.text.onLight}
                accessibilityLabel="Enter your Birth Date"
                value={date}
                editable={false}
                onPress={() => {
                  if (Platform.OS === "ios") setOpenCalendar(true);
                }}
              />
            </Pressable>

            {!isValidBirthDayAt && (
              <Text style={styles.validationText}>
                {localization.t(LOCALIZATION_KEYS.TXT_VALIDATE_INCORRECT_DATE)}
              </Text>
            )}
          </View>
          <View style={styles.updateButtonContainer}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_UPDATE_PROFILE)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              width={244}
              py={8}
              onPress={handleUpdate}
              btnStyle={styles.updateButton}
              color={colors.text.onLight}
              textStyle={styles.updateButtonText}
            ></DefaultButton>
          </View>
          <CalendarWeb
            onChange={handleDateChange}
            isVisible={openCalendar}
            onClose={() => setOpenCalendar(false)}
          />
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
    paddingVertical: 16,
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
  hiddenInput: {
    display: "none",
  },
});

export default EditProfileScreen;
