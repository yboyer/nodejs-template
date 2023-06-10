import { useCallback } from 'react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'

import { Routing } from './routing'

//

export function useRedirect() {
  const location = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (
      route: Routing,
      opts?: NavigateOptions & { params: { [params: string]: string } },
    ) => {
      if (location.pathname === route) {
        window.location.reload()
        return
      }

      const updatedRoute = opts?.params
        ? Object.keys(opts.params).reduce(
            (v, k) => v.replace(`:${k}`, opts.params[k]),
            route,
          )
        : route

      navigate(updatedRoute, opts)
    },
    [location.pathname, navigate],
  )
}
