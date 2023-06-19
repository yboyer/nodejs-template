import { JWTPayload, jwtVerify, SignJWT } from 'jose'

import envConfig from '@/../config'

//

interface Payload extends JWTPayload {
  type: 'auth' | 'refresh'
}

export async function signJWT<Extra extends Record<string, any>>({
  sub,
  expiration = '1h',
  type,
  extra,
}: {
  sub: string
  expiration?: string
  type?: Payload['type']
  extra?: Extra
}): Promise<string> {
  const jwt = await new SignJWT({ ...extra, type })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setExpirationTime(expiration)
    .sign(new TextEncoder().encode(envConfig.secretKey))

  return jwt
}

export async function decodeJWT<T extends Payload>(
  jwt: string,
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(envConfig.secretKey),
    )
    return payload as T
  } catch (err) {
    return null
  }
}
