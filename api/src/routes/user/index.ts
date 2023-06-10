import { FastifyPluginCallback } from 'fastify'

import { checkJWT } from '@/middlewares/auth'

import { getOpts, getHandler } from './get'
import { resendCodeHandler, resendCodeOpts } from './resendCode'

//

export const userRoutes: FastifyPluginCallback = (server, options, next) => {
  server.addHook('preHandler', checkJWT)

  server.get('/me', getOpts, getHandler)
  server.get('/me/resendCode', resendCodeOpts, resendCodeHandler)

  next()
}
