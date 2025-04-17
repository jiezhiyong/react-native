import { Button, Row, scale, Spacer, Text, View } from 'expo-dev-client-components';

type SettingsRowButtonProps = {
  icon: React.ReactElement<any> | null;
  label: string;
  description?: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SettingsRowButton({ label, icon, description = '', onPress, disabled }: SettingsRowButtonProps) {
  return (
    <Button.FadeOnPressContainer onPress={onPress} bg="default" disabled={disabled}>
      <Row padding="small" align="center" bg="default" style={{ opacity: disabled ? 0.75 : 1 }}>
        {icon && (
          <View width="large" height="large">
            {icon}
          </View>
        )}

        <Spacer.Horizontal size="small" />

        <View>
          <Text>{label}</Text>
        </View>

        <Spacer.Horizontal />

        <View width="16" style={{ alignItems: 'flex-end' }} />
      </Row>

      {Boolean(description) && (
        <View style={{ transform: [{ translateY: -scale['3'] }] }}>
          <Row px="small" align="center">
            <Spacer.Horizontal size="large" />

            <View shrink="1" px="small">
              <Text size="small" color="secondary" leading="large">
                {description}
              </Text>
            </View>

            <View width="16" />
          </Row>
          <Spacer.Vertical size="tiny" />
        </View>
      )}
    </Button.FadeOnPressContainer>
  );
}
