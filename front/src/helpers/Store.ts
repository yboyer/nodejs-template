import { createContext, useContext } from 'react'

import { initRootStore } from '../models/RootStore'

//

export const rootStore = initRootStore()
export const RootStoreContext = createContext(rootStore)
export const useStore = () => useContext(RootStoreContext)
