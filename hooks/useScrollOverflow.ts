import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

export function useScrollOverflow() {
  const [isScrollable, setIsScrollable] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleContentSizeChange = useCallback(
    (_width: number, contentHeight: number) => {
      setIsScrollable(contentHeight > containerHeight);
    },
    [containerHeight]
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  return { isScrollable, handleContentSizeChange, handleLayout };
}
