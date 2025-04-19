declare module 'react-native-qr-decode-image-camera' {
  /**
   * 读取图片中的二维码
   * @param fileUrl 图片文件的路径
   * @returns Promise 解析后的二维码内容
   */
  export function QRreader(fileUrl: string): Promise<string>;
}
