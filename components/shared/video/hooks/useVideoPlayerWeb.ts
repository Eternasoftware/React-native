import { useVideoPlayer } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, AppState, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useSettingsStore from "@/store/settingsStore";
import { formatTime } from "@/utils/functions";
import { useInternetConnection } from "@/hooks/useInternetConnection";
import { useShallow } from "zustand/react/shallow";
import { CastState, useCastState, useRemoteMediaClient } from "../utils/castPlatform";

export type WebVideoPlayerProps = {
  pauseKey: number;
  source: string;
  startTime?: number;
  onPlayToEnd?: (preventRun: boolean) => void;
  onShowPanel?: () => void;
  onHidePanel?: () => void;
  onSaveVideoTime?: (time: number) => void;
  restartVideo?: boolean;
};

export function useVideoPlayerWeb({
  pauseKey = 0,
  source,
  startTime = 0,
  onPlayToEnd = () => {},
  onShowPanel = () => {},
  onHidePanel = () => {},
  onSaveVideoTime = () => {},
  restartVideo = false,
}: WebVideoPlayerProps) {
  const { isFullScreen, setIsFullScreen } = useSettingsStore(
    useShallow((s) => ({
      isFullScreen: s.isFullScreen,
      setIsFullScreen: s.setIsFullScreen,
    }))
  );

  const videoViewRef = useRef<{
    enterFullscreen: () => void;
    exitFullscreen: () => void;
  } | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const route = useRoute();
  const navigation = useNavigation();
  const progressIntervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const isFirstLoad = useRef(true);
  const [isShowControls, setIsShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(formatTime(0));
  const [currTime, setCurrTime] = useState(formatTime(0));
  const [appState, setAppState] = useState(AppState.currentState);

  const castState = useCastState();
  const client = useRemoteMediaClient();

  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
  });

  const { showConnectionError, setShowConnectionError } = useInternetConnection(isPlaying, {
    delayBeforeShow: 5000,
  });

  const stopInterval = useCallback(() => {
    if (progressIntervalId.current) {
      clearInterval(progressIntervalId.current);
      progressIntervalId.current = null;
    }
  }, []);

  const runInterval = useCallback(() => {
    stopInterval();
    progressIntervalId.current = setInterval(() => {
      if (player.duration) {
        setProgress(player.currentTime / player.duration);
        setCurrTime(formatTime(player.currentTime));
      }
    }, 500);
  }, [player, stopInterval]);

  const toggleFade = useCallback(() => {
    if (isShowControls) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsShowControls(false));
    } else {
      setIsShowControls(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isShowControls]);

  const showControls = useCallback(
    (ms = 0) => {
      setTimeout(() => {
        if (isShowControls) {
          onHidePanel();
        } else {
          onShowPanel();
        }
        toggleFade();
      }, ms);
    },
    [isShowControls, onHidePanel, onShowPanel, toggleFade]
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      if (castState === CastState.CONNECTED && client) {
        player.pause();
        setIsPlaying(false);
        client.loadMedia({
          mediaInfo: { contentUrl: source },
          startTime: player.currentTime,
        });
      }
    }
  }, [castState, client, player, source]);

  useEffect(() => {
    player.pause();
    if (Platform.OS === "web" && document.pictureInPictureElement) {
      stopInterval();
      document.exitPictureInPicture();
    }
  }, [pauseKey, player, stopInterval]);

  useEffect(() => {
    if (restartVideo && player) {
      player.currentTime = 0;
      player.play();
    }
  }, [player, restartVideo]);

  useEffect(() => {
    return () => {
      stopInterval();
      videoViewRef.current = null;
    };
  }, [stopInterval]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e: { data: { state: { index: number; routes: { name: string }[] } } }) => {
      const index = e.data.state.index;
      const activeRoute = e.data.state.routes[index].name;

      if (
        Platform.OS === "web" &&
        activeRoute !== route.name &&
        document &&
        document.pictureInPictureElement
      ) {
        stopInterval();
        document.exitPictureInPicture();
      }
    });

    return unsubscribe;
  }, [navigation, route.name, stopInterval]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState === "active" && nextAppState.match(/inactive|background/)) {
        if (videoViewRef.current && player) {
          player.pause();
        }
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState, player]);

  const onSlidingComplete = useCallback(
    (value: number) => {
      if (videoViewRef.current && player) {
        stopInterval();
        const seekTime = Math.round(player.duration * value);
        player.currentTime = seekTime;
        setProgress(value);
        setCurrTime(formatTime(seekTime));
        if (isPlaying) {
          runInterval();
        }
      }
    },
    [isPlaying, player, runInterval, stopInterval]
  );

  const onSlidingStart = useCallback(() => {
    stopInterval();
  }, [stopInterval]);

  const rewind = useCallback(
    (isForward: boolean) => {
      if (player && player.duration) {
        const val = isForward ? player.currentTime + 15 : player.currentTime - 15;
        if (val <= 0) {
          player.currentTime = 0.1;
        } else if (val > player.duration) {
          player.currentTime = player.duration - 1;
        } else {
          player.currentTime = val;
        }
        setProgress(player.currentTime / player.duration);
      }
    },
    [player]
  );

  const changeMode = useCallback(() => {
    if (videoViewRef.current && player) {
      setIsFullScreen(!isFullScreen);
      if (Platform.OS !== "ios") {
        videoViewRef.current.enterFullscreen();
      }
    }
  }, [isFullScreen, player, setIsFullScreen]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, player]);

  useEffect(() => {
    let playIntervalId: ReturnType<typeof setInterval> | null = null;

    const playingChangeSubscription = player.addListener("playingChange", (event) => {
      if (videoViewRef.current && player) {
        if (event.isPlaying) {
          runInterval();
          if (playIntervalId) clearInterval(playIntervalId);
          playIntervalId = setInterval(() => {
            if (player?.currentTime) onSaveVideoTime(player.currentTime);
          }, 10000);
        } else {
          stopInterval();
          if (playIntervalId) clearInterval(playIntervalId);
        }
        setIsPlaying(event.isPlaying);
        setDuration(formatTime(player.duration));
      }
    });

    const playToEndSubscription = player.addListener("playToEnd", () => {
      if (videoViewRef.current && player) {
        player.pause();
        setProgress(0.0001);
        stopInterval();
        setCurrTime(formatTime(0));
        if (videoViewRef.current && isFullScreen && Platform.OS === "web") {
          videoViewRef.current.exitFullscreen();
        }
        if (Platform.OS !== "android") {
          setIsFullScreen(false);
        }
        player.currentTime = 0;
        if (Platform.OS === "web" && document && document.pictureInPictureElement) {
          document.exitPictureInPicture();
        }
        onPlayToEnd(Platform.OS === "android" && isFullScreen);
      }
    });

    const sourceChangeSubscription = player.addListener("statusChange", (status) => {
      if (status.status === "readyToPlay") {
        setDuration(formatTime(player.duration));

        if (isFirstLoad.current) {
          player.currentTime = startTime;
          onSaveVideoTime(startTime < player.duration ? startTime : 1);
          player.play();
          isFirstLoad.current = false;
        }
      }
    });

    return () => {
      playingChangeSubscription.remove();
      playToEndSubscription.remove();
      sourceChangeSubscription.remove();
      stopInterval();
      if (playIntervalId) clearInterval(playIntervalId);
    };
  }, [
    isFullScreen,
    onPlayToEnd,
    onSaveVideoTime,
    player,
    runInterval,
    setIsFullScreen,
    startTime,
    stopInterval,
  ]);

  const handleFullscreenEnter = useCallback(() => {
    setIsFullScreen(true);
  }, [setIsFullScreen]);

  const handleFullscreenExit = useCallback(() => {
    setIsFullScreen(false);
  }, [setIsFullScreen]);

  return {
    player,
    videoViewRef,
    isFullScreen,
    isShowControls,
    fadeAnim,
    progress,
    duration,
    currTime,
    isPlaying,
    showConnectionError,
    setShowConnectionError,
    showControls,
    onSlidingComplete,
    onSlidingStart,
    rewind,
    changeMode,
    togglePlayPause,
    handleFullscreenEnter,
    handleFullscreenExit,
  };
}
