import { config } from 'dotenv'

// Load the .env configuration
const result = config()
if (result.error) {
  throw result.error
}

const envConfig = {
  host: process.env.HOST ?? '0.0.0.0',
  secretKey: process.env.SECRET_KEY ?? 'dev',
  isDev: process.env.IS_DEV ?? false,
  port: Number(process.env.PORT) || 3000,
  dev: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development',
  test: process.env.NODE_ENV === 'test',
  production: process.env.NODE_ENV === 'production',
  logLevel: process.env.NODE_LOG_LEVEL ?? 'info',
  mailgun: {
    url: 'https://api.eu.mailgun.net',
    key: 'XX',
    domain: 'XX',
    defaults: {
      from: 'EX <EX@gmail.com>',
    },
  },
}

export default envConfig
