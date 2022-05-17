import { getRepository } from 'typeorm'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

// Criando tipos internos para diminuir o código digitado nos tipos devido ao namespace
type SavePictureInput = SaveUserPictureRepository.Input
type LoadProfileInput = LoadUserProfileRepository.Input
type LoadProfileOutput = LoadUserProfileRepository.Output

export class PgUserProfileRepository implements
SaveUserPictureRepository {
  async savePicture ({ id, pictureUrl, initials }: SavePictureInput): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: Number(id) }, {
      pictureUrl: pictureUrl ?? null,
      initials: initials ?? null
    })
  }

  async loadProfile ({ userId }: LoadProfileInput): Promise<LoadProfileOutput> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { id: Number(userId) } })

    if (pgUser === null || pgUser.name === null) {
      return undefined
    }
    return {
      name: pgUser.name
    }
  }
}
