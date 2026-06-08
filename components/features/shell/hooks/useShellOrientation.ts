import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Orientation } from "expo-screen-orientation";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

export function useShellOrientation() {
  const { setOrientation } = useSettingsStore(
    useShallow((s) => ({
      setOrientation: s.setOrientation,
    }))
  );

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      const info = evt.orientationInfo.orientation;
      if (info === Orientation.LANDSCAPE_LEFT) {
        setOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      } else if (info === Orientation.LANDSCAPE_RIGHT) {
        setOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      } else {
        setOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [setOrientation]);
}
