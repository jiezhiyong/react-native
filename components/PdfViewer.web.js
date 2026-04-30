import { View } from 'react-native';

const iframeStyle = {
  border: 0,
  height: '100%',
  width: '100%',
};

export default function PdfViewer({ uri, style }) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <iframe src={uri} style={iframeStyle} title="PDF Preview" />
    </View>
  );
}
