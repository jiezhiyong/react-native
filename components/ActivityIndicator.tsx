import { type ActivityIndicatorProps, ActivityIndicator as RNActivityIndicator } from 'react-native';

import { NAV_THEME } from '@/lib/theme';

export type AppActivityIndicatorProps = ActivityIndicatorProps & {
  className?: string;
};

export function ActivityIndicator({ color = NAV_THEME.light.colors.primary, ...props }: AppActivityIndicatorProps) {
  return <RNActivityIndicator color={color} {...props} />;
}

export default ActivityIndicator;
