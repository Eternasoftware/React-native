import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
import { getLayoutVariant, LayoutVariant } from "@/utils/layout/breakpoints";

export function useLayoutVariant(): LayoutVariant {
  const { screenWidth } = useSettingsStore(
    useShallow((s) => ({
      screenWidth: s.screenWidth,
    }))
  );

  return getLayoutVariant(screenWidth);
}
