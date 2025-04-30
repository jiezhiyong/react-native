import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export const InfoItem = ({ label, value }: { label: string; value?: string | number | boolean | null }) => (
  <View className="py-3 border-b border-gray-100 flex-row gap-5">
    <Text className="text-muted-foreground">{label}</Text>
    <Text className="font-medium flex-1 text-right">{value ? String(value) : '-'}</Text>
  </View>
);
