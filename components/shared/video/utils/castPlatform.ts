import React from "react";
import { Platform } from "react-native";

let AirPlayButton: React.ComponentType<{
  style?: object;
  tintColor?: string;
}> = () => null;

if (Platform.OS === "ios") {
  AirPlayButton = require("react-native-airplay-button").default;
}

let useCastState: () => string | null = () => null;
let useRemoteMediaClient: () => {
  loadMedia: (options: { mediaInfo: { contentUrl: string }; startTime: number }) => void;
} | null = () => null;
let CastState: { CONNECTED: string } = { CONNECTED: "CONNECTED" };
let CastButton: React.ComponentType<{ style?: object }> | null = null;

if (Platform.OS === "android") {
  const GoogleCast = require("react-native-google-cast");
  useCastState = GoogleCast.useCastState;
  useRemoteMediaClient = GoogleCast.useRemoteMediaClient;
  CastState = GoogleCast.CastState;
  CastButton = GoogleCast.CastButton;
}

export { AirPlayButton, CastButton, CastState, useCastState, useRemoteMediaClient };
