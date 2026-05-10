import { StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

import { PdfViewerProps } from './PdfViewer';

export default function PdfViewer({ uri, style }: PdfViewerProps) {
  return <Pdf source={{ uri, cache: true }} style={[styles.viewer, style]} trustAllCerts={false} />;
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
  },
});
