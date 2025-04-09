/**
 * API 路由
 * https://docs.expo.dev/router/reference/api-routes/
 */
export async function POST(request: Request) {
  const { code } = await request.json();

  const githubClientId = 'Ov23li3LwycXQxfxkQGv';
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: 'd041c1e5e4cc546e992a8ca2d630fa112b167dd6', // 敏感信息，只在服务器端使用
      code,
    }),
  });

  const res = await response.json();

  return Response.json(res);
}
