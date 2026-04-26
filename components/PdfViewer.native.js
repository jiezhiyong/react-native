import { StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewer({ uri, style }) {
  return <Pdf source={{ uri, cache: true }} style={[styles.viewer, style]} trustAllCerts={false} />;
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
  },
});
