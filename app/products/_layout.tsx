import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function StackLayout() {
  return (
    <Stack
      // 静态配置路由选项
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
