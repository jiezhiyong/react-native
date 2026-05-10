import { View } from 'react-native';

import { PdfViewerProps } from './PdfViewer';

const iframeStyle = {
  border: 0,
  height: '100%',
  width: '100%',
} as const;

export default function PdfViewer({ uri, style }: PdfViewerProps) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <iframe src={uri} style={iframeStyle} title="PDF Preview" />
    </View>
  );
}
