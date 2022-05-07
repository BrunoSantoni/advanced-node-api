export namespace SaveUserPictureRepository {
  export type Input = {
    pictureUrl?: string
  }
}

export interface SaveUserPictureRepository {
  savePicture: (input: SaveUserPictureRepository.Input) => Promise<void>
}

export namespace LoadUserProfileRepository {
  export type Input = {
    userId: string
  }
}

export interface LoadUserProfileRepository {
  loadProfile: (input: LoadUserProfileRepository.Input) => Promise<void>
}
