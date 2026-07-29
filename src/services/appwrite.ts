import { ID, type Models } from 'appwrite'
import { account } from '../config/appwrite'

const authService = {
  async register(email: string, password: string, name: string): Promise<Models.Session> {
    await account.create(ID.unique(), email, password, name)
    return account.createEmailPasswordSession(email, password)
  },
  login(email: string, password: string): Promise<Models.Session> {
    return account.createEmailPasswordSession(email, password)
  },
  logout(): Promise<object> {
    return account.deleteSession('current')
  },
  getCurrentUser(): Promise<Models.User<Models.Preferences>> {
    return account.get()
  },
  updateName(name: string): Promise<Models.User<Models.Preferences>> {
    return account.updateName(name)
  },
}

export { authService }
