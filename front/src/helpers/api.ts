import ky from 'ky'

import config from '../config'

const api = ky.extend({
  prefixUrl: config.API_URL,
})

export const Client = {
  async query(query: string) {
    return await api
      .get('query', {
        searchParams: {
          text: query,
        },
      })
      .json()
  },
}
