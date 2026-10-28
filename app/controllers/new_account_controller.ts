import User from '#models/user'
import Member from '#models/member'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    /**
     * Link the login to the Mecatron member with the same email, if any
     */
    const member = await Member.findBy('email', email)
    const user = await User.create({ fullName, email, password, memberId: member?.id ?? null })

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
