import { LOCALIZATION_KEYS } from "@/utils/constants/localization";

export type Lang = {
  [key in LOCALIZATION_KEYS]: string;
};

export type Localization = {
  [key: string]: Lang;
};
