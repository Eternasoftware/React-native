import { useEffect } from "react";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

export function useSurveyPage() {
  const { toggleShowNavBar } = useSettingsStore(
    useShallow((s) => ({
      toggleShowNavBar: s.toggleShowNavBar,
    }))
  );

  useEffect(() => {
    toggleShowNavBar(false);
  }, []);
}
