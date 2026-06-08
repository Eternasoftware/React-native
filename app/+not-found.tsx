import { View, StyleSheet, TouchableOpacity, Alert, Text } from "react-native";
import { Link, Stack, useRouter, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { colors } from "@/assets/styles/constants";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function NotFoundScreen() {
  const route = useRoute();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.includes("/app/")) {
      router.replace("/");
      return;
    }
  }, [pathname]);

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
        <TouchableOpacity
          onPress={() => Alert.alert(route.name, JSON.stringify(route.params))}
          style={styles.alertButton}
        ></TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: colors.text.inverse,
  },
  alertButton: {
    backgroundColor: colors.surface.splash,
    width: 70,
    height: 70,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
