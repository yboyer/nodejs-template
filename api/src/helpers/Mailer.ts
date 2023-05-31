import formData from 'form-data'
import Mailgun from 'mailgun.js'

import envConfig from '@/../config'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
  username: 'api',
  url: envConfig.mailgun.url,
  key: envConfig.mailgun.key,
})

interface SendProps {
  from?: string
  to: string
  html: string
  subject: string
}
export default {
  async send({
    to,
    html,
    subject,
    from = envConfig.mailgun.defaults.from,
  }: SendProps) {
    try {
      const res = await mg.messages.create(envConfig.mailgun.domain, {
        from,
        to,
        subject,
        html,
      })
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  },
}
