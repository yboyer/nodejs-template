import { observer } from 'mobx-react-lite'
import { Routes, Route } from 'react-router-dom'

import { useStore } from './helpers/Store'
import useRoutes from './helpers/useRoutes'
import { NotFound } from './routes/NotFound'

//

export const App = observer(() => {
  const store = useStore()
  const routes = useRoutes(store)

  return (
    <>
      <Routes>
        {routes.map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
})
