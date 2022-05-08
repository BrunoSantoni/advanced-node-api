import { getRepository } from 'typeorm'
import { SaveUserPictureRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

// Criando tipos internos para diminuir o código digitado nos tipos devido ao namespace
type SavePictureInput = SaveUserPictureRepository.Input

export class PgUserProfileRepository implements
SaveUserPictureRepository {
  async savePicture ({ id, pictureUrl, initials }: SavePictureInput): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: Number(id) }, {
      pictureUrl,
      initials: initials ?? null
    })
  }
}
