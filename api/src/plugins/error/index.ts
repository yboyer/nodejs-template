import { Boom } from '@hapi/boom'
import { FastifyReply } from 'fastify'

import { HttpError as HttpErrorResponse } from '@/types/errors'

//

export function serializeError(err: Boom, res: FastifyReply): void {
  const message: HttpErrorResponse = {
    ...err.output.payload,
    data: err.data,
  }

  void res.status(err.output.statusCode).send(message)
}
