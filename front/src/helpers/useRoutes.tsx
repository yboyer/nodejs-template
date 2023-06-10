import { useMemo } from 'react'

import type { RootStore } from '../models/RootStore'
import { Home } from '../routes/Home'
import { Logout } from '../routes/Logout'
import { Routing } from './routing'

//

interface Route {
  path: Routing
  element: JSX.Element
}

const base: Route[] = [{ path: Routing.HomePath, element: <Home /> }]

export default function useRoutes(store: RootStore): Route[] {
  return useMemo(() => {
    if (!store.user.email) {
      return base
    }

    return [{ path: Routing.LogoutPath, element: <Logout /> }, ...base]
  }, [store.user.email])
}
