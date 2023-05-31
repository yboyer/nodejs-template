/* eslint-disable @typescript-eslint/no-unsafe-return */
import { user, type Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { customAlphabet } from 'nanoid'

import Mailer from '@/helpers/Mailer'
import { db } from '@/utils'

const nanoid = customAlphabet('0123456789', 5)

export function checkPassword(str: string) {
  if (str.length < 8) {
    return false
  }
  return true
}

db.$use(async (params, next) => {
  if (params.model !== 'user') {
    return await next(params)
  }
  if (params.action === 'create') {
    const data: Prisma.userCreateInput = params.args.data
    data.email = data.email.toLocaleLowerCase()
    data.password = await bcrypt.hash(data.password, 8)
  }
  return await next(params)
})

export const { user: User } = db.$extends({
  model: {
    user: {
      isPasswordValid(u: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, u.password)
      },
      async sendConfirmationCode(u: User) {
        const confirmationCode = nanoid(5)

        await User.update({
          where: { id: u.id },
          data: { confirmationCode },
        })

        await Mailer.send({
          to: u.email,
          html: '',
          subject: `Code de confirmation: ${confirmationCode}`,
        })
      },
    },
  },
})

export type User = user
export type userCreateInput = Prisma.userCreateInput
