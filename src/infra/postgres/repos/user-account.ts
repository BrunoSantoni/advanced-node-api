import { getRepository } from 'typeorm'
import { LoadUserAccountRepository, SaveUserAccountByFacebookRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

// Criando tipos internos para diminuir o código digitado nos tipos devido ao namespace
type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveByFacebookParams = SaveUserAccountByFacebookRepository.Params
type SaveByFacebookResult = SaveUserAccountByFacebookRepository.Result

export class PgUserAccountRepository implements
LoadUserAccountRepository,
SaveUserAccountByFacebookRepository {
  private readonly pgUserRepo = getRepository(PgUser)
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({
      where: {
        email
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

  async saveWithFacebook ({ id, name, email, facebookId }: SaveByFacebookParams): Promise<SaveByFacebookResult> {
    if (id !== undefined) {
      await this.pgUserRepo.update({
        id: parseInt(id)
      }, {
        name,
        facebookId
      })

      return {
        id
      }
    }

    const { id: createdUserId } = await this.pgUserRepo.save({
      name,
      email,
      facebookId
    })

    return {
      id: createdUserId.toString()
    }
  }
}
