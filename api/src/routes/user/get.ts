import { HttpErrorSchema } from '@/types/errors'
import { Handler, RouteDoc } from '@/types/fastify'

import { CS } from '@keplr/typed-ajv'

//

const ReplySchema = CS.Object(
  {
    user: CS.Object(
      {
        id: CS.String(true),
        email: CS.String(true),
      },
      true,
      { nullable: true },
    ),
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

export const getOpts = {
  schema,
}

//

// eslint-disable-next-line @typescript-eslint/require-await
export const getHandler: Handler<Reply> = async ({ user }) => ({
  user: {
    id: user.id,
    email: user.email,
  },
})
