import { DeleteProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/usecases'

export const makeDeleteProfilePictureController = (): DeleteProfilePictureController => {
  // Data
  const changeProfilePicture = makeChangeProfilePicture()

  // Presentation
  return new DeleteProfilePictureController(changeProfilePicture)
}
