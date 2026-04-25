import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export const InfoItemCol = ({ label, value }: { label: string; value?: string | number | boolean | null }) => {
  return (
    <View className="py-2 border-b border-border">
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text className="font-medium text-lg">{value ? String(value) : '-'}</Text>
    </View>
  );
};

export const InfoItemRow = ({ label, value }: { label: string; value?: string | number | boolean | null }) => {
  return (
    <View className="flex-row gap-1 justify-between py-4 border-b border-border">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="font-medium">{value ? String(value) : '-'}</Text>
    </View>
  );
};
