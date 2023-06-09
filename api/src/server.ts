import boom from '@hapi/boom'
import fastify, { FastifyInstance } from 'fastify'

import { serializeError } from '@/plugins/error'

import envConfig from '../config'
import { rootRoutes } from './routes/root'
import { userRoutes } from './routes/user'
import { db } from './utils'

//

export type Server = FastifyInstance

export default function createServer() {
  const server = fastify({
    disableRequestLogging: true,
    logger: {
      level: envConfig.dev ? 'debug' : envConfig.logLevel,
    },
    ajv: {
      customOptions: {
        strict: 'log',
      },
    },
  })

  if (envConfig.dev) {
    void server.register(import('@fastify/swagger'), {
      swagger: {
        info: {
          title: 'API',
          version: '',
        },
      },
    })

    void server.register(import('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
      },
    })
  }

  const mode = envConfig.production ? 'prod' : 'dev'
  console.log(`App is running in ${mode} mode`)

  // void server.register(fastifyHelmet)
  void server.register(import('fastify-file-upload'), {
    tempFileDir: '/tmp/',
    useTempFiles: true,
    preserveExtension: true,
  })
  void server.register(import('@fastify/cors'), {
    origin: '*',
  })

  // Global error handler
  server.setErrorHandler((err, req, res) => {
    const statusCode = boom.isBoom(err) ? err.output.statusCode : err.statusCode
    if (statusCode && statusCode >= 500) {
      req.log.error(err)
    } else if (statusCode && statusCode >= 400) {
      req.log.info(err)
    } else {
      req.log.error(err)
    }

    if (boom.isBoom(err)) {
      serializeError(err, res)
      return
    }

    void res.send(err)
  })

  server.get('/health', async () => {
    await db.$connect()

    return {}
  })

  void server.register(rootRoutes)
  void server.register(userRoutes)

  return server
}
