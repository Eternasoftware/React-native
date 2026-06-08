import { useRef, useState, useEffect } from "react";
import { Animated } from "react-native";
type UseVideoControlsProps = {
  isPlaying: boolean;
  isSliding?: boolean;
};

export const useVideoControls = ({ isPlaying, isSliding = false }: UseVideoControlsProps) => {
  const [isShowControls, setIsShowControls] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hideControlsTimeout = useRef<any>(null);

  const toggleFade = (isShowControls: boolean) => {
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
  };

  const startHideControlsTimer = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (!isSliding) {
      hideControlsTimeout.current = setTimeout(() => {
        toggleFade(isShowControls);
      }, 5000);
    }
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (!isShowControls) toggleFade(isShowControls);
    startHideControlsTimer();
  };

  const handleOverlayPress = () => {
    if (isShowControls) {
      toggleFade(isShowControls);
    } else {
      resetHideControlsTimer();
    }
  };

  const handleButtonPress = () => {
    resetHideControlsTimer();
  };

  const handleSlidingStart = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
  };

  const handleSlidingComplete = () => {
    startHideControlsTimer();
  };

  useEffect(() => {
    if (isPlaying && isShowControls && !isSliding) {
      startHideControlsTimer();
    }
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isPlaying, isShowControls, isSliding]);

  return {
    isShowControls,
    fadeAnim,
    toggleFade,
    resetHideControlsTimer,
    handleOverlayPress,
    handleButtonPress,
    handleSlidingStart,
    handleSlidingComplete,
  };
};
