import { CS } from '@keplr/typed-ajv'

//

export const errorTypes = {}

export const HttpError = CS.Object(
  {
    // HTTP error message
    error: CS.String(false),
    // HTTP status code
    statusCode: CS.Integer(true),
    // Human-readable message providing more details about the error
    message: CS.String(false),
    /*
      For some errors that could be handled programmatically,
      a short string indicating the error code reported
    */
    code: CS.String(false),
    // Some data related to error for further action
    data: CS.Any(false),
  },
  true,
)
export type HttpError = typeof HttpError.type

export const HttpErrorSchema = HttpError.getJsonSchema()
