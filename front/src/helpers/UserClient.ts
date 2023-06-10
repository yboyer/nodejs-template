import axios, { AxiosInstance, AxiosError } from 'axios'

import config from '../config'
import { APIError } from './api'

//

export class UserClient {
  onNewTokens: (data: { accessToken: string; refreshToken: string }) => void

  client: AxiosInstance

  refreshToken?: string

  constructor({
    accessToken,
    refreshToken,
    onNewTokens,
    onSigninNeeded,
  }: {
    accessToken?: string
    refreshToken?: string
    onNewTokens: (data: { accessToken: string; refreshToken: string }) => void
    onSigninNeeded: () => void
  }) {
    this.refreshToken = refreshToken
    this.onNewTokens = onNewTokens

    console.log(config)

    this.client = axios.create({
      baseURL: config.API_URL,
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${accessToken ?? ''}`,
      },
    })
    this.client.interceptors.request.use(
      c => {
        console.debug(`[${(c.method ?? '').toUpperCase()}] ${c.url ?? ''}`)
        return c
      },
      error => Promise.reject(error),
    )
    this.client.interceptors.response.use(
      undefined,
      async (err: AxiosError) => {
        if (err.response?.status === 401) {
          try {
            const { data } = await this.client<{
              accessToken: string
              refreshToken: string
            }>('/refreshToken', {
              baseURL: config.API_URL,
              headers: { Authorization: `Bearer ${refreshToken ?? ''}` },
            })
            onNewTokens(data)

            if (!err.config) {
              return null
            }

            err.config.headers.Authorization = `Bearer ${data.accessToken}`

            return await axios(err.config)
          } catch (e) {
            onSigninNeeded()
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            return await Promise.resolve()
          }
        }

        throw new APIError(err)
      },
    )
  }

  async refresh(signal?: AbortSignal) {
    if (!this.refreshToken) {
      return
    }
    const { data } = await this.client('/refreshToken', {
      baseURL: config.API_URL,
      headers: { Authorization: `Bearer ${this.refreshToken}` },
      signal,
    })
    this.onNewTokens(data)
  }

  async signin(d: { email: string; password: string }, signal?: AbortSignal) {
    const { data } = await this.client.post('/signin', d, { signal })
    if (data.error) {
      throw new APIError(data)
    }
    return data
  }

  async resendConfirmationCode(signal?: AbortSignal) {
    const { data } = await this.client.get('/user/resendCode', { signal })
    if (data.error) {
      throw new APIError(data)
    }
    return data
  }

  async signup(
    d: {
      email: string
      password: string
    },
    signal?: AbortSignal,
  ) {
    const { data } = await this.client.post('/signup', d, { signal })
    return data
  }

  async get(signal?: AbortSignal) {
    const { data } = await this.client.get('/me', { signal })
    return data
  }
}
