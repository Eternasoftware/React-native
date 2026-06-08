import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { OnLoadData, VideoRef } from "react-native-video";
import * as Device from "expo-device";
import useSettingsStore from "@/store/settingsStore";
import { WorkoutType } from "@/types/program.type";
import useLandscapeBox from "@/hooks/useLandscapeBox";
import { useVideoControls } from "@/hooks/useVideoControls";
import { useInternetConnection } from "@/hooks/useInternetConnection";
import { useShallow } from "zustand/react/shallow";
import { CastState, useCastState, useRemoteMediaClient } from "../utils/castPlatform";
import { getLandscapeContainerStyle } from "../utils/getLandscapeContainerStyle";

export type VideoPlayerMobileProps = {
  programTitle: string;
  workout: WorkoutType;
  pauseKey?: number;
  onBack: () => void;
  onPlayToEnd?: () => void;
  onSkip?: () => void;
  onSaveVideoTime?: (time: number) => void;
  onVideoWatchStatus?: (isFullyWatched: boolean) => void;
  rounded?: number;
  restartVideo?: boolean;
  isBackButton?: boolean;
};

export function useVideoPlayerMobile({
  workout,
  pauseKey = 0,
  onPlayToEnd = () => {},
  onSkip = () => {},
  onSaveVideoTime = () => {},
  onVideoWatchStatus = () => {},
  restartVideo = false,
}: VideoPlayerMobileProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currTime, setCurrTime] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState<boolean | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isSliding, setIsSliding] = useState(false);

  const castState = useCastState();
  const client = useRemoteMediaClient();
  const lastSavedTime = useRef(workout.secondsWatched || 0);
  const hasUserSeeked = useRef(false);
  const hasUserSkipped = useRef(false);

  const { boxW, boxH, offsetX, offsetY } = useLandscapeBox();

  const {
    isShowControls,
    fadeAnim,
    handleOverlayPress,
    handleButtonPress,
    handleSlidingStart,
    handleSlidingComplete,
  } = useVideoControls({ isPlaying, isSliding });

  const { showConnectionError, setShowConnectionError } = useInternetConnection(isPlaying, {
    delayBeforeShow: 5000,
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      if (castState === CastState.CONNECTED && client) {
        setIsPlaying(false);
        videoRef.current?.pause();
        client.loadMedia({
          mediaInfo: { contentUrl: workout.video },
          startTime: currTime,
        });
      }
    }
  }, [castState, client, currTime, workout.video]);

  useEffect(() => {
    setIsPlaying(false);
  }, [pauseKey]);

  useEffect(() => {
    if (restartVideo && videoRef.current) {
      videoRef.current.seek(0);
      setIsPlaying(true);
    }
  }, [restartVideo]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appState === "active" && /inactive|background/.test(next)) {
        setIsPlaying(false);
      }
      setAppState(next);
    });
    return () => sub.remove();
  }, [appState]);

  const handleLoad = useCallback(
    async (data: OnLoadData) => {
      const type = await Device.getDeviceTypeAsync();
      const isTablet = type === Device.DeviceType.TABLET;
      const timeToEnd = data.duration - lastSavedTime.current;
      const startTime = timeToEnd < 10 ? lastSavedTime.current - 10 : workout.secondsWatched || 0;

      setDuration(data.duration);
      setIsHorizontal(data.naturalSize.width > data.naturalSize.height || isTablet);

      if (startTime > 0) {
        videoRef.current?.seek(startTime);
        lastSavedTime.current = startTime;
        onSaveVideoTime(startTime);
      }

      setIsPlaying(true);
    },
    [onSaveVideoTime, workout.secondsWatched]
  );

  const handleError = useCallback((error: unknown) => {
    console.error("Video playback error:", error);
  }, []);

  const handleProgress = useCallback(
    (data: { currentTime: number }) => {
      setCurrTime(data.currentTime);
      setProgress(duration > 0 ? data.currentTime / duration : 0);

      if (data.currentTime - lastSavedTime.current >= 10) {
        onSaveVideoTime(data.currentTime);
        lastSavedTime.current = data.currentTime;
      }
    },
    [duration, onSaveVideoTime]
  );

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrTime(0);
    const isFullyWatched = !hasUserSeeked.current && !hasUserSkipped.current;
    onVideoWatchStatus(isFullyWatched);
    onPlayToEnd();
    videoRef.current?.seek(0);
  }, [onPlayToEnd, onVideoWatchStatus]);

  const onSlidingStart = useCallback(() => {
    setIsSliding(true);
    handleSlidingStart();
  }, [handleSlidingStart]);

  const onSlidingComplete = useCallback(
    (value: number) => {
      const seekTime = Math.round(duration * value);
      hasUserSeeked.current = true;
      videoRef.current?.seek(seekTime);
      setProgress(value);
      setCurrTime(seekTime);
      setIsSliding(false);
      handleSlidingComplete();
    },
    [duration, handleSlidingComplete]
  );

  const rewind = useCallback(
    (forward: boolean) => {
      const val = forward ? currTime + 15 : currTime - 15;
      const newTime = Math.max(0, Math.min(val, duration));
      hasUserSeeked.current = true;
      videoRef.current?.seek(newTime);
      setProgress(duration > 0 ? newTime / duration : 0);
      setCurrTime(newTime);
    },
    [currTime, duration]
  );

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSkip = useCallback(() => {
    hasUserSkipped.current = true;
    const isFullyWatched = !hasUserSeeked.current && !hasUserSkipped.current;
    onVideoWatchStatus(isFullyWatched);
    onSkip();
    handleButtonPress();
  }, [handleButtonPress, onSkip, onVideoWatchStatus]);

  const landscapeStyle = getLandscapeContainerStyle(isHorizontal, {
    boxW,
    boxH,
    offsetX,
    offsetY,
  });

  return {
    localization,
    videoRef,
    workout,
    isPlaying,
    progress,
    duration,
    currTime,
    isHorizontal,
    isShowControls,
    fadeAnim,
    showConnectionError,
    setShowConnectionError,
    landscapeStyle,
    handleOverlayPress,
    handleButtonPress,
    handleLoad,
    handleError,
    handleProgress,
    handleEnd,
    onSlidingStart,
    onSlidingComplete,
    rewind,
    togglePlayPause,
    handleSkip,
  };
}
