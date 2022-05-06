export namespace SaveUserPictureRepository {
  export type Input = {
    pictureUrl?: string
  }
}

export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Input) => Promise<void>
}
