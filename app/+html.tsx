import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="apple-itunes-app" content="app-id=6744351306" />
        <style
          dangerouslySetInnerHTML={{
            __html: `html, body, #root { height: 100% } body { overflow: hidden } #root { display: flex }`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
