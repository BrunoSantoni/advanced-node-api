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
  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({
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

  async saveWithFacebook (params: SaveByFacebookParams): Promise<SaveByFacebookResult> {
    if (params.id !== undefined) {
      await this.pgUserRepo.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })

      return {
        id: params.id
      }
    }

    const createdUser = await this.pgUserRepo.save({
      name: params.name,
      email: params.email,
      facebookId: params.facebookId
    })

    return {
      id: createdUser.id.toString()
    }
  }
}
