import { useEffect } from 'react'

import { useStore } from '../helpers/Store'
import { Routing } from '../helpers/routing'
import { useRedirect } from '../helpers/useRedirect'

//

export function Logout() {
  const store = useStore()
  const goTo = useRedirect()

  useEffect(() => {
    void store.logout().then(() => {
      goTo(Routing.HomePath)
    })
  }, [goTo, store])

  return <></>
}
