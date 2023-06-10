import { AxiosError } from 'axios'

//

export class APIError extends Error {
  /** body */
  data: Record<string, any>

  /** HTTP code */
  code: number

  constructor(error: unknown) {
    super()
    this.code = 0
    this.data = {}

    if (error instanceof AxiosError) {
      if (error.response?.data) {
        this.message = error.response.data.message
        this.code = error.response.data.statusCode
        this.data = error.response.data.data
      } else {
        this.message = error.message
      }
    } else if (error instanceof Error) {
      this.message = error.message
    } else {
      this.message = 'Erreur inconnue'
    }
  }
}
