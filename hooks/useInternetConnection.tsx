import { useEffect, useRef, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

type UseInternetConnectionOptions = {
  delayBeforeShow?: number;
  onConnectionLost?: () => void;
  onConnectionRestored?: () => void;
};
type UseInternetConnectionReturn = {
  isOnline: boolean | null;
  showConnectionError: boolean;
  setShowConnectionError: (show: boolean) => void;
};

export const useInternetConnection = (
  isPlaying: boolean,
  options: UseInternetConnectionOptions = {}
): UseInternetConnectionReturn => {
  const { delayBeforeShow = 5000, onConnectionLost, onConnectionRestored } = options;

  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const connectionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isConnected = state.isInternetReachable;
      setIsOnline(isConnected);

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      if (isConnected === false && isPlaying) {
        connectionTimeoutRef.current = setTimeout(() => {
          setShowConnectionError(true);
          onConnectionLost?.();
        }, delayBeforeShow);
      } else if (isConnected === true) {
        setShowConnectionError(false);
        onConnectionRestored?.();
      }
    });

    NetInfo.fetch().then((state) => {
      setIsOnline(state.isInternetReachable);
    });

    return () => {
      unsubscribeNetInfo();
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [isPlaying, delayBeforeShow, onConnectionLost, onConnectionRestored]);

  return {
    isOnline,
    showConnectionError,
    setShowConnectionError,
  };
};

export default useInternetConnection;
