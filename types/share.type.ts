import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type ShareSlide = {
  image: string | null;
  transparent?: boolean;
  preview: (containerStyle: StyleProp<ViewStyle>) => ReactNode;
  previewStyle: StyleProp<ViewStyle>;
  storyStyle: StyleProp<ViewStyle>;
};

export enum SocialList {
  Facebook = "facebook",
  FacebookStories = "facebookstories",
  Pagesmanager = "pagesmanager",
  Twitter = "twitter",
  Whatsapp = "whatsapp",
  Whatsappbusiness = "whatsappbusiness",
  Instagram = "instagram",
  InstagramStories = "instagramstories",
  Googleplus = "googleplus",
  Email = "email",
  Pinterest = "pinterest",
  Linkedin = "linkedin",
  Sms = "sms",
  Telegram = "telegram",
  Snapchat = "snapchat",
  Messenger = "messenger",
  Viber = "viber",
  Discord = "discord",
}
