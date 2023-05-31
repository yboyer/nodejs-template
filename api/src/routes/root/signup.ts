import { badRequest } from '@hapi/boom'

import { tokens } from '@/helpers/User'
import { User, checkPassword } from '@/models/User'
import { HttpErrorSchema } from '@/types/errors'
import { Handler, RouteDoc } from '@/types/fastify'

import { CS } from '@keplr/typed-ajv'

const ReplySchema = CS.Object(
  {
    accessToken: CS.String(true),
    refreshToken: CS.String(true),
  },
  true,
)
export type Reply = typeof ReplySchema.type

const BodySchema = CS.Object(
  {
    email: CS.String(true),
    password: CS.String(true),
    firstname: CS.String(true),
    lastname: CS.String(true),
    type: CS.AnyOf(
      [CS.Const('teacher' as const, true), CS.Const('student' as const, true)],
      true,
    ),
  },
  true,
)
export type Body = typeof BodySchema.type

export const signupSchema: RouteDoc = {
  body: BodySchema.getJsonSchema(),
  response: {
    200: ReplySchema.getJsonSchema(),
    400: HttpErrorSchema,
    404: HttpErrorSchema,
  },
}

// Options

export const signupOpts = {
  schema: signupSchema,
}

export const signupHandler: Handler<Reply, Body> = async ({ body }) => {
  if (!checkPassword(body.password)) {
    throw badRequest('password invalid')
  }

  const user = await User.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })

  return await tokens(user.id)
}
