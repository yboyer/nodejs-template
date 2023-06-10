import _ from 'lodash'
import { makeAutoObservable, runInAction } from 'mobx'
import {
  clearPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store'

import { UserClient } from '../helpers/UserClient'
import { APIError } from '../helpers/api'
import type { RootStore } from './RootStore'

//

interface UserDataRes {
  email: string
}

export class UserStore {
  email?: UserDataRes['email']

  accessToken?: string = undefined

  refreshToken?: string = undefined

  refreshing = false

  client!: UserClient

  private readonly rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    makeAutoObservable(this, {
      client: false,
    })

    void makePersistable(this, {
      name: 'UserStore',
      properties: _.pull(
        Object.keys(this),
        'refreshing',
        'client',
        'rootStore',
      ) as (keyof this)[],
      storage: window.localStorage,
    }).then(() => {
      this.initClient()
      void this.refresh()
    })
  }

  initClient() {
    this.client = new UserClient({
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      onSigninNeeded: () => {
        console.log('Logout needed')
        void this.rootStore.logout()
      },
      onNewTokens: ({ accessToken, refreshToken }) => {
        this.updateTokens({
          accessToken,
          refreshToken,
        })
      },
    })
  }

  updateTokens(tokens: { accessToken: string; refreshToken: string }) {
    runInAction(() => {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
      this.initClient()
    })
  }

  async clean() {
    await clearPersistedStore(this)
    stopPersisting(this)
  }

  async signin(...args: Parameters<typeof this.client.signin>) {
    const data = await this.client.signin(...args)
    this.updateTokens(data)
    await this.refresh()
  }

  async signup(...args: Parameters<typeof this.client.signup>) {
    const data = await this.client.signup(...args)
    this.updateTokens(data)
    await this.refresh()
  }

  init(data: UserDataRes) {
    this.email = data.email
    this.email = data.email
  }

  async refresh(): Promise<void> {
    if (!this.accessToken) {
      return
    }
    runInAction(() => {
      this.refreshing = true
    })
    try {
      const { user } = await this.client.get()

      runInAction(() => {
        this.init(user)
      })
    } catch (err) {
      if (err instanceof APIError && err.code === 401) {
        await this.rootStore.logout()
        return
      }
    }
    runInAction(() => {
      this.refreshing = false
    })
  }
}
