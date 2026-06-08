import React, { useEffect, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView, LayoutChangeEvent } from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import NavHeader from "@/components/shared/NavHeader";
import CheckItem from "@/components/shared/CheckItem";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type DeviceScreenProps = {
  onBack: () => void;
  onNext: (deviceTypes: string[]) => void;
};

const DeviceScreen: React.FC<DeviceScreenProps> = ({ onBack, onNext }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const [devicesToReturn, setDevicesToReturn] = useState<string[]>([]);
  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [devices, setDevices] = useState([
    { id: 0, title: localization.t(LOCALIZATION_KEYS.BTN_DEVICE_GIMBAL), value: false },
    { id: 1, title: localization.t(LOCALIZATION_KEYS.BTN_DEVICE_RACK), value: false },
    { id: 2, title: localization.t(LOCALIZATION_KEYS.BTN_DEVICE_LINEAR_JUJITSU), value: false },
    { id: 3, title: localization.t(LOCALIZATION_KEYS.BTN_DEVICE_GRAPPLE), value: false },
    {
      id: 4,
      title: localization.t(LOCALIZATION_KEYS.BTN_NO_EQUIPMENT),
      value: false,
    },
  ]);

  const handleChange = (index: number) => {
    if (index === devices.length - 1 && !devices[index].value) {
      setDevices((prevDevices) =>
        prevDevices.map((device, i) => {
          return { ...device, value: index === i ? true : false };
        })
      );
    } else if (index !== devices.length - 1) {
      setDevices((prevDevices) =>
        prevDevices.map((device, i) =>
          device.id === devices[index].id
            ? {
                ...device,
                value: !devices[index].value,
              }
            : {
                ...device,
                value: i === devices.length - 1 ? false : device.value,
              }
        )
      );
    } else {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === devices[index].id ? { ...device, value: !devices[index].value } : device
        )
      );
    }
  };

  const getDataForSurvey = () => {
    const data: string[] = [];

    devices.forEach((device) => {
      if (device.value) {
        data.push(device.title);
      }
    });

    setDevicesToReturn(data);
  };

  useEffect(() => {
    getDataForSurvey();
  }, [devices]);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <View style={styles.content}>
        <NavHeader onBack={onBack} text="" />

        <View style={styles.textBlock}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_DEVICE)}</Text>
          <Text style={styles.descriptionText}>
            {localization.t(LOCALIZATION_KEYS.DESCR_DEVICE)}
          </Text>
        </View>
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.devicesContainer, styles.scrollContent]}>
            {devices.map((item, index) => (
              <CheckItem
                text={item.title}
                value={item.value}
                onChange={() => handleChange(index)}
                key={item.id}
              />
            ))}
          </View>
        </ScrollView>
        <View style={{ marginBottom: 57 }}>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
            bg={colors.surface.app}
            bgActive={colors.action.primary}
            width={155}
            py={8}
            onPress={() => onNext(devicesToReturn)}
            textActive={colors.text.onLight}
            btnStyle={styles.button}
            color={colors.text.body}
            textStyle={styles.buttonText}
            disabled={!devicesToReturn.length}
          ></DefaultButton>
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
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 35,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  devicesContainer: {
    flex: 1,
    width: "100%",
    gap: 16,
    maxWidth: 500,
    marginHorizontal: "auto",
  },
  textBlock: {
    gap: 26,
    paddingTop: 24,
    marginBottom: 34,
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
});

export default DeviceScreen;
