import { Row, Spacer, Text, View } from 'expo-dev-client-components';
import * as React from 'react';
type AppInfoRowProps = {
  title: string;
  value: string;
};

export function AppInfoRow({ title, value }: AppInfoRowProps) {
  return (
    <Row px="medium" py="small" align="center" bg="default" justify="between" flex="1">
      <Text size="medium">{title}</Text>
      <Spacer.Horizontal size="small" />
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text size="medium" numberOfLines={2}>
          {value}
        </Text>
      </View>
    </Row>
  );
}
