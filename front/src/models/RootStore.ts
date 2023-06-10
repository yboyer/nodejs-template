import { makeAutoObservable, runInAction } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

import { UserStore } from './UserStore'

//

export class RootStore {
  user: UserStore

  constructor() {
    this.user = new UserStore(this)

    makeAutoObservable(this, {})

    void makePersistable(this, {
      name: 'RootStore',
      properties: [],
      storage: window.localStorage,
    })
  }

  async logout() {
    await this.user.clean()

    runInAction(() => {
      this.user = new UserStore(this)
    })
  }
}

export function initRootStore() {
  const rootStore = new RootStore()
  return rootStore
}
