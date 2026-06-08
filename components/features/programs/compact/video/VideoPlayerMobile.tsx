import React from "react";
import { View } from "react-native";
import Video, { ViewType } from "react-native-video";
import ConnectionErrorNativeModal from "@/components/shared/modals/ConnectionErrorNativeModal";
import { WorkoutType } from "@/types/program.type";
import { useVideoPlayerMobile } from "./hooks/useVideoPlayerMobile";
import { mobilePlayerStyles as styles } from "./styles/videoPlayerMobile.styles";
import { MobilePlayerOverlay } from "./components/MobilePlayerOverlay";
import { MobilePlayerTopPanel } from "./components/MobilePlayerTopPanel";
import { MobilePlayerCenterControls } from "./components/MobilePlayerCenterControls";
import { MobilePlayerBottomPanel } from "./components/MobilePlayerBottomPanel";

export type PlayerProps = {
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

export const VideoPlayerMobile: React.FC<PlayerProps> = (props) => {
  const {
    programTitle,
    workout,
    rounded = 0,
    onBack = () => {},
    isBackButton = false,
  } = props;

  const {
    localization,
    videoRef,
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
  } = useVideoPlayerMobile(props);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View
        style={[
          styles.contentContainer,
          { borderRadius: rounded, opacity: isHorizontal === null ? 0 : 1 },
          landscapeStyle,
        ]}
      >
        <MobilePlayerOverlay
          isShowControls={isShowControls}
          fadeAnim={fadeAnim}
          onOverlayPress={handleOverlayPress}
        />

        <Video
          ref={videoRef}
          source={{ uri: workout.video }}
          onLoad={handleLoad}
          onError={handleError}
          onProgress={handleProgress}
          onEnd={handleEnd}
          style={styles.video}
          paused={!isPlaying}
          muted={false}
          repeat={false}
          resizeMode="contain"
          viewType={ViewType.TEXTURE}
          playInBackground={false}
          playWhenInactive={false}
          disableDisconnectError={true}
        />

        <MobilePlayerTopPanel
          isShowControls={isShowControls}
          isBackButton={isBackButton}
          fadeAnim={fadeAnim}
          onBack={onBack}
          onOverlayPress={handleOverlayPress}
          onButtonPress={handleButtonPress}
        />

        <MobilePlayerCenterControls
          isShowControls={isShowControls}
          isPlaying={isPlaying}
          fadeAnim={fadeAnim}
          onRewind={rewind}
          onTogglePlayPause={togglePlayPause}
          onButtonPress={handleButtonPress}
        />

        <MobilePlayerBottomPanel
          isShowControls={isShowControls}
          fadeAnim={fadeAnim}
          localization={localization}
          programTitle={programTitle}
          workoutTitle={workout.title}
          progress={progress}
          currTime={currTime}
          duration={duration}
          onSkip={handleSkip}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
        />
      </View>

      <ConnectionErrorNativeModal
        isVisible={showConnectionError}
        onClose={() => setShowConnectionError(false)}
      />
    </View>
  );
};

export default VideoPlayerMobile;
