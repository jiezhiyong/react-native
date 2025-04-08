import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';

/**
 * 测试深层链接
 * https://docs.expo.dev/linking/into-your-app/#test-the-deep-link
 * https://www.branch.io/deep-linking
 *
 * npx uri-scheme list
 * npx uri-scheme open com.jiezhiyong.qachat://deep-link --android
 * npx uri-scheme open qachat://deep-link --ios
 */
export default function DeepLink() {
  const url = Linking.useURL() || '';

  const { hostname, path, queryParams } = Linking.parse(url);
  return (
    <View className="p-5">
      <Text>URL: {url}</Text>
      <Text>Hostname: {hostname}</Text>
      <Text>Path: {path}</Text>
      <Text>Query Params: {JSON.stringify(queryParams)}</Text>
    </View>
  );
}
