import { useCallback } from 'react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'

import { Routing } from './routing'

//

export function updateRouting(
  route: Routing,
  params: { [param: string]: string },
) {
  return Object.keys(params).reduce(
    (v, k) => v.replace(`:${k}`, params[k]),
    route,
  ) as Routing
}

export function useRedirect() {
  const location = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (
      route: Routing,
      opts?: NavigateOptions & { params: { [param: string]: string } },
    ) => {
      if (location.pathname === route) {
        window.location.reload()
        return
      }

      const updatedRoute = opts?.params
        ? updateRouting(route, opts.params)
        : route

      navigate(updatedRoute, opts)
    },
    [location.pathname, navigate],
  )
}
