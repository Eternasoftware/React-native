import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import LocalizationAPI from "@utils/api/localization";

export const initLocalization = async () => {
  const translations = await LocalizationAPI.getLocalization();
  const i18n = new I18n(translations);
  i18n.locale = getLocales()[0].languageCode ?? "en";
  i18n.enableFallback = true;
  return i18n;
};

export default initLocalization;
