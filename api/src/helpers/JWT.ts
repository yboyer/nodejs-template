import { JWTPayload, jwtVerify, SignJWT } from 'jose'

import envConfig from '@/../config'

//

interface Payload extends JWTPayload {
  sub: 'auth' | 'refresh'
}

export async function signJWT<Extra extends Record<string, any>>({
  id,
  expiration = '1h',
  type = 'auth',
  extra,
}: {
  id: string
  expiration?: string
  type?: Payload['sub']
  extra?: Extra
}): Promise<string> {
  const jwt = await new SignJWT(extra ?? {})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(id)
    .setSubject(type)
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
