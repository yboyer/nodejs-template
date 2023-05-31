import { FastifyPluginCallback } from 'fastify'

import { refreshTokenHandler, refreshTokenOpts } from './refreshToken'
import { signinOpts, signinHandler } from './signin'
import { signupOpts, signupHandler } from './signup'

//

export const rootRoutes: FastifyPluginCallback = (server, options, next) => {
  server.post('/signin', signinOpts, signinHandler)
  server.post('/signup', signupOpts, signupHandler)
  server.get('/refreshToken', refreshTokenOpts, refreshTokenHandler)
  next()
}
