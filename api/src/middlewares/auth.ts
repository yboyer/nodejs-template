import boom from '@hapi/boom'
import { FastifyRequest } from 'fastify/types/request'

import { decodeJWT } from '@/helpers/JWT'
import { User } from '@/models'

//

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
}

export async function checkJWT(req: FastifyRequest) {
  const jwt = req.headers.authorization?.split(' ').pop()
  if (!jwt) {
    throw boom.unauthorized()
  }

  const res = await decodeJWT(jwt)
  if (!res) {
    throw boom.unauthorized()
  }

  if (res.type !== 'auth' || !res.sub) {
    throw boom.unauthorized()
  }

  const user = await User.findFirst({
    where: {
      id: res.sub,
    },
  })

  if (!user) {
    throw boom.unauthorized()
  }

  // eslint-disable-next-line require-atomic-updates
  req.user = user
}
