import { getRepository } from 'typeorm'
import { LoadUserAccountRepository, SaveUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)

    const pgUser = await pgUserRepo.findOne({
      where: {
        email: params.email
      }
    })

    if (pgUser === null) {
      return undefined
    }

    const userInfo = {
      id: pgUser.id.toString(),
      name: pgUser.name
    }

    if (pgUser.name === null) {
      delete userInfo.name
    }

    return userInfo
  }

  async saveWithFacebook (params: SaveUserAccountByFacebookRepository.Params): Promise<SaveUserAccountByFacebookRepository.Result> {
    const pgUserRepo = getRepository(PgUser)

    const createdUser = await pgUserRepo.save({
      name: params.name,
      email: params.email,
      facebookId: params.facebookId
    })

    return {
      id: createdUser.id.toString()
    }
  }
}
