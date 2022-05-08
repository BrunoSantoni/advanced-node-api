export namespace SaveUserPictureRepository {
  export type Input = {
    id: string
    pictureUrl?: string
    initials?: string
  }
}

export interface SaveUserPictureRepository {
  savePicture: (input: SaveUserPictureRepository.Input) => Promise<void>
}

export namespace LoadUserProfileRepository {
  export type Input = {
    userId: string
  }
  export type Output = {
    name?: string
  } | undefined
}

export interface LoadUserProfileRepository {
  loadProfile: (input: LoadUserProfileRepository.Input) => Promise<LoadUserProfileRepository.Output>
}
