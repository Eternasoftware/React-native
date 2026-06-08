import React from "react";
import { Animated, Platform, View } from "react-native";
import { VideoView } from "expo-video";
import { colors } from "@/assets/styles/constants";
import ConnectionErrorNativeModal from "@/components/shared/modals/ConnectionErrorNativeModal";
import { useVideoPlayerWeb } from "./hooks/useVideoPlayerWeb";
import { webPlayerStyles as styles } from "./styles/videoPlayer.styles";
import { WebPlayerOverlay } from "./components/WebPlayerOverlay";
import { WebPlayerControls } from "./components/WebPlayerControls";
import { WebPlayerProgressBar } from "./components/WebPlayerProgressBar";

export type PlayerProps = {
  pauseKey: number;
  source: string;
  startTime?: number;
  onPlayToEnd?: (preventRun: boolean) => void;
  onShowPanel?: () => void;
  onHidePanel?: () => void;
  onSaveVideoTime?: (time: number) => void;
  rounded?: number;
  restartVideo?: boolean;
};

export const VideoPlayer: React.FC<PlayerProps> = (props) => {
  const { rounded = 0 } = props;

  const {
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
  } = useVideoPlayerWeb(props);

  return (
    <View style={[styles.contentContainer, { borderRadius: rounded }]}>
      <WebPlayerOverlay
        isShowControls={isShowControls}
        fadeAnim={fadeAnim}
        onOverlayPress={() => showControls()}
      />

      <VideoView
        ref={videoViewRef as never}
        style={[
          styles.video,
          {
            backgroundColor: isFullScreen ? colors.surface.overlay : colors.surface.splash,
          },
        ]}
        player={player}
        allowsFullscreen
        allowsVideoFrameAnalysis={false}
        nativeControls={Platform.OS !== "ios" && isFullScreen}
        contentFit="contain"
        allowsPictureInPicture={false}
        onFullscreenEnter={handleFullscreenEnter}
        onFullscreenExit={handleFullscreenExit}
      />

      <View style={styles.controlsContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {isShowControls && (
            <>
              <WebPlayerControls
                isPlaying={isPlaying}
                isFullScreen={isFullScreen}
                onRewind={rewind}
                onTogglePlayPause={togglePlayPause}
                onChangeMode={changeMode}
              />
              <WebPlayerProgressBar
                progress={progress}
                currTime={currTime}
                duration={duration}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSlidingComplete}
              />
            </>
          )}
        </Animated.View>
      </View>

      <ConnectionErrorNativeModal
        isVisible={showConnectionError}
        onClose={() => setShowConnectionError(false)}
      />
    </View>
  );
};

export default VideoPlayer;
