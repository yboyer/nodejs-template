import boom from '@hapi/boom'

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

const BodySchema = CS.Object(
  { email: CS.String(true), password: CS.String(true) },
  true,
)
export type Body = typeof BodySchema.type

export const schema: RouteDoc = {
  body: BodySchema.getJsonSchema(),
  response: {
    200: ReplySchema.getJsonSchema(),
    400: HttpErrorSchema,
    404: HttpErrorSchema,
  },
}

export const signinOpts = {
  schema,
}

//

export const signinHandler: Handler<Reply, Body> = async ({ body }) => {
  const user = await User.findFirst({
    where: { email: body.email.toLowerCase() },
  })

  if (!user) {
    throw boom.notFound('User not found')
  } else {
    if (!(await User.isPasswordValid(user, body.password))) {
      throw boom.notFound('User not found')
    }
  }

  return await tokens(user.id)
}
