import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';
import * as React from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  onOpen: () => void;
};

const SHAKE_FORCE_THRESHOLD = 1.33;
const SHAKE_MIN_DIRECTION_CHANGES = 3;
const SHAKE_WINDOW_MS = 600;
const SHAKE_DISPATCH_INTERVAL_MS = 600;

function getDominantDirection({ x, y, z }: AccelerometerMeasurement) {
  const values = [
    { axis: 'x', value: x },
    { axis: 'y', value: y },
    { axis: 'z', value: z },
  ];
  const dominant = values.reduce((max, item) => (Math.abs(item.value) > Math.abs(max.value) ? item : max), values[0]);

  if (Math.abs(dominant.value) < SHAKE_FORCE_THRESHOLD) {
    return null;
  }

  return `${dominant.axis}:${dominant.value > 0 ? 1 : -1}`;
}

export function PreviewDebugPanelTriggers({ children, disabled, onOpen }: Props) {
  const onOpenRef = React.useRef(onOpen);
  const disabledRef = React.useRef(disabled);
  const lastDirectionRef = React.useRef<string | null>(null);
  const directionChangesRef = React.useRef(0);
  const lastShakeSampleAtRef = React.useRef(0);
  const lastDispatchAtRef = React.useRef(0);
  const [isActive, setIsActive] = React.useState(AppState.currentState === 'active');

  React.useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  React.useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const openDebugPanel = React.useCallback(() => {
    if (!disabledRef.current) {
      onOpenRef.current();
    }
  }, []);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      setIsActive(nextState === 'active');
    });

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    if (!isActive || disabled) {
      return;
    }

    let isMounted = true;
    let subscription: { remove: () => void } | undefined;

    const handleMeasurement = (measurement: AccelerometerMeasurement) => {
      if (disabledRef.current) {
        return;
      }

      const now = Date.now();
      const direction = getDominantDirection(measurement);

      if (!direction) {
        return;
      }

      if (now - lastShakeSampleAtRef.current > SHAKE_WINDOW_MS) {
        directionChangesRef.current = 0;
        lastDirectionRef.current = null;
      }

      lastShakeSampleAtRef.current = now;

      if (lastDirectionRef.current && lastDirectionRef.current !== direction) {
        directionChangesRef.current += 1;
      }

      lastDirectionRef.current = direction;

      if (
        directionChangesRef.current >= SHAKE_MIN_DIRECTION_CHANGES &&
        now - lastDispatchAtRef.current >= SHAKE_DISPATCH_INTERVAL_MS
      ) {
        directionChangesRef.current = 0;
        lastDispatchAtRef.current = now;
        openDebugPanel();
      }
    };

    Accelerometer.isAvailableAsync()
      .then((isAvailable) => {
        if (!isMounted || !isAvailable) {
          return;
        }

        Accelerometer.setUpdateInterval(100);
        subscription = Accelerometer.addListener(handleMeasurement);
      })
      .catch((error) => {
        console.warn('DebugPanel 摇晃触发器不可用', error);
      });

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [disabled, isActive, openDebugPanel]);

  const threeFingerLongPress = React.useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(700)
        .maxDistance(32)
        .numberOfPointers(3)
        .onEnd((_event, success) => {
          if (success) {
            runOnJS(openDebugPanel)();
          }
        }),
    [openDebugPanel]
  );

  return (
    <GestureDetector gesture={threeFingerLongPress}>
      <View style={styles.container}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
