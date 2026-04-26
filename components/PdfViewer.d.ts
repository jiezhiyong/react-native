import type * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

type PdfViewerProps = {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

declare function PdfViewer(props: PdfViewerProps): React.ReactElement;

export default PdfViewer;
