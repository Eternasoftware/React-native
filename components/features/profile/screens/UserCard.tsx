import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { useShallow } from "zustand/react/shallow";

type UserCardProps = {
  imageUrl: string;
  name: string;
  email: string;
};

const UserCard: React.FC<UserCardProps> = ({ imageUrl, name, email }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image resizeMode="cover" source={{ uri: imageUrl }} style={styles.img} />
      </View>
      {name && <Text style={styles.name}>{name}</Text>}
      {email ? (
        <Text style={styles.email}>{email}</Text>
      ) : (
        <DefaultButton
          text={localization.t(LOCALIZATION_KEYS.BTN_PROFILE_GUEST)}
          bg={colors.action.primary}
          bgActive={colors.surface.card}
          width={244}
          py={8}
          onPress={() => router.push("/login")}
          btnStyle={styles.loginButton}
          color={colors.text.onLight}
          textStyle={styles.loginButtonText}
        ></DefaultButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.box,
    borderRadius: 10,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 4,
  },
  imgContainer: {
    width: 125,
    height: 125,
    borderColor: colors.border.subtle,
    borderRadius: 100,
    marginBottom: 10,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
  },
  email: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
  },
  loginButton: {
    borderColor: "none",
    borderWidth: 0,
  },
  loginButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
});

export default UserCard;
