import { renderRouter, screen } from 'expo-router/testing-library';
import { View } from 'react-native';

/**
 * 路由渲染测试
 * https://docs.expo.dev/router/reference/testing/
 */
it('my-test', async () => {
  const MockComponent = jest.fn(() => <View />);

  renderRouter(
    {
      index: MockComponent,
      'directory/a': MockComponent,
      '(group)/b': MockComponent,
    },
    {
      initialUrl: '/directory/a',
    }
  );

  expect(screen).toHavePathname('/directory/a');
});
