import boom from '@hapi/boom'

import { decodeJWT } from '@/helpers/JWT'
import { tokens } from '@/helpers/User'
import { User } from '@/models/User'
import { HttpErrorSchema } from '@/types/errors'
import { Handler, RouteDoc } from '@/types/fastify'

import { CS } from '@keplr/typed-ajv'

//

const ReplySchema = CS.Object(
  {
    accessToken: CS.String(true),
    refreshToken: CS.String(true),
  },
  true,
)
export type Reply = typeof ReplySchema.type

export const schema: RouteDoc = {
  response: {
    200: ReplySchema.getJsonSchema(),
    400: HttpErrorSchema,
    404: HttpErrorSchema,
  },
}

export const refreshTokenOpts = {
  schema,
}

//

export const refreshTokenHandler: Handler<Reply> = async ({ headers }) => {
  if (!headers.authorization) {
    throw boom.unauthorized()
  }

  const decoded = await decodeJWT(headers.authorization.split(' ')[1])
  if (!decoded || decoded.sub !== 'refresh') {
    throw boom.unauthorized()
  }

  const user = await User.findFirst({
    where: { id: decoded.iss },
  })

  if (!user) {
    throw boom.unauthorized()
  }

  return await tokens(user.id)
}
