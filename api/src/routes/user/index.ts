import { FastifyPluginCallback } from 'fastify'

import { checkJWT } from '@/middlewares/auth'

import { getOpts, getHandler } from './get'
import { resendCodeHandler, resendCodeOpts } from './resendCode'

//

export const userRoutes: FastifyPluginCallback = (server, options, next) => {
  server.addHook('preHandler', checkJWT)

  server.get('/user', getOpts, getHandler)
  server.get('/user/resendCode', resendCodeOpts, resendCodeHandler)

  next()
}
