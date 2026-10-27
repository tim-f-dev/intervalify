import { useCallback, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';

export function useScreenLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  return { width, height, fontScale, dense: height < 700, landscape: width > height * 1.2 };
}
export function useAvailableArea() {
  const [area, setArea] = useState({ width: 0, height: 0 });
  const onLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const width = Math.floor(layout.width), height = Math.floor(layout.height);
    setArea((before) => before.width === width && before.height === height ? before : { width, height });
  }, []);
  return { area, onLayout };
}
