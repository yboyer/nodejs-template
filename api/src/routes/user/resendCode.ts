import { User } from '@/models'
import { HttpErrorSchema } from '@/types/errors'
import { Handler, RouteDoc } from '@/types/fastify'

import { CS } from '@keplr/typed-ajv'

const ReplySchema = CS.Object({ wait: CS.Number(true) }, true)
export type Reply = typeof ReplySchema.type

export const resendCodeSchema: RouteDoc = {
  response: {
    200: ReplySchema.getJsonSchema(),
    404: HttpErrorSchema,
    422: HttpErrorSchema,
  },
}

// Options

export const resendCodeOpts = {
  schema: resendCodeSchema,
}

export const resendCodeHandler: Handler<Reply> = async ({ user }) => {
  await User.sendConfirmationCode(user)
  return { wait: 30 }
}
