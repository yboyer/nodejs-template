import crypto from 'crypto'

//

export function getId(size = 6) {
  if (!size) {
    throw new Error('size greater than 0')
  }
  if (size % 2) {
    throw new Error('size be a multiple of 2')
  }
  return crypto.randomBytes(size / 2).toString('hex')
}
