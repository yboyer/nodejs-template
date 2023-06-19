import { signJWT } from './JWT'

//

export async function tokens(id: string) {
  const [accessToken, refreshToken] = await Promise.all([
    signJWT({ sub: id, type: 'auth' }),
    signJWT({ sub: id, type: 'refresh', expiration: '14d' }),
  ])

  return { accessToken, refreshToken }
}
