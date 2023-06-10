import 'module-alias/register'
import 'make-promises-safe'

import { db } from '@/utils'

import envConfig from '../config'
import createServer from './server'

//

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function run() {
  try {
    await db.$connect()
  } catch (err) {
    console.error(err)
    await db.$disconnect()
    await wait(5000)
    void run()
    return
  }

  const server = createServer()
  await server.listen({
    port: Number(envConfig.port),
    host: envConfig.host,
  })
}

void run()

process.on('uncaughtException', err => {
  console.error(err.message, { stack: err.stack })
  void db.$disconnect()

  console.error('Exit now.')
  process.exit(1)
})
