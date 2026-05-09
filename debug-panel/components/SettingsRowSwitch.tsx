import { Row, scale, Spacer, Text, View } from 'expo-dev-client-components';
import { StyleSheet, Switch } from 'react-native';

type SettingsRowSwitchProps = {
  icon: React.ReactElement<any>;
  label: string;
  description?: string;
  isEnabled?: boolean;
  setIsEnabled: (isEnabled: boolean) => void;
  testID: string;
  disabled?: boolean;
};

export function SettingsRowSwitch({
  label,
  description = '',
  icon,
  isEnabled,
  setIsEnabled,
  disabled,
  testID,
}: SettingsRowSwitchProps) {
  return (
    <View style={{ opacity: disabled ? 0.75 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <Row padding="small" align="center">
        <View width="large" height="large" style={styles.iconContainer}>
          {icon}
        </View>

        <Spacer.Horizontal size="small" />

        <View grow="1" shrink="1" style={styles.labelContainer}>
          <Text>{label}</Text>
        </View>

        <Spacer.Horizontal />

        <View width="16" style={styles.trailingContainer}>
          <Switch
            testID={testID}
            disabled={disabled}
            value={isEnabled && !disabled}
            onValueChange={() => setIsEnabled(!isEnabled)}
          />
        </View>
      </Row>

      {Boolean(description) && (
        <View style={{ transform: [{ translateY: -8 }] }}>
          <Row px="small" align="center">
            <Spacer.Horizontal size="large" />

            <View shrink="1" px="small">
              <Text size="small" color="secondary" leading="large">
                {description}
              </Text>
            </View>

            <View style={{ width: scale[16] }} />
          </Row>
          <Spacer.Vertical size="tiny" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    justifyContent: 'center',
    minHeight: scale.large,
  },
  trailingContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
