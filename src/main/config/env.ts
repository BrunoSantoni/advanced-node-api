export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1626923747672842',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'c1490c22aad5b8fb4a163de94d9158aa'
  },
  jwtSecret: process.env.JWT_SECRET ?? 'f68sd4f684',
  port: process.env.PORT ?? 3333
}
