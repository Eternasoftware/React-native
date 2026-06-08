import { View, Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors } from "@/assets/styles/constants";

export const toastConfig = {
  success: (props: any) => {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.text.accent }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: "400",
        }}
      />
    );
  },

  error: (props: any) => {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red" }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: "400",
        }}
      />
    );
  },

  tomatoToast: ({ text1, props }: any) => {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    );
  },
};

export function toastSuccess(text: string) {
  if (typeof window === "undefined") {
    return null;
  }
  Toast.show({
    type: "success",
    text1: "Success",
    text2: text,
  });
}

export function toastInfo(text: string) {
  if (typeof window === "undefined") {
    return null;
  }
  Toast.show({
    type: "success",
    text1: "Info",
    text2: text,
  });
}

export function toastError(text: string) {
  if (typeof window === "undefined") {
    return null;
  }
  Toast.show({
    type: "error",
    text1: "Error",
    text2: text,
  });
}
