import type * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

export type PdfViewerProps = {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * TypeScript/Meta：`tsc` 需要无后缀的 `PdfViewer` 模块；
 * Metro 仍会优先打包 `.native` / `.web`。
 */
export default function PdfViewer(_props: PdfViewerProps): React.ReactElement {
  throw new Error('[PdfViewer] Metro must resolve PdfViewer.native.tsx or PdfViewer.web.tsx.');
}
