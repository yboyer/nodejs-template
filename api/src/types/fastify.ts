import {
  FastifySchema,
  RawServerBase,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
} from 'fastify'
import { RouteHandlerMethod } from 'fastify/types/route'

//

export type RouteDoc = FastifySchema

export interface FileType {
  name: string
  data: Buffer
  size: number
  encoding: string
  tempFilePath: string
  truncated: boolean
  mimetype: string
  md5: string
  mv: (filename: string) => Promise<void>
}

interface Raw extends RawRequestDefaultExpression {
  files?: {
    [filename: string]: FileType
  }
}

export type Handler<
  Reply,
  Body = unknown,
  Params = unknown,
  Query = unknown,
  Headers = unknown,
> = RouteHandlerMethod<
  RawServerBase,
  Raw,
  RawReplyDefaultExpression,
  {
    Body: Body
    Params: Params
    Querystring: Query
    Reply: Reply
    Headers: Headers
  }
>
