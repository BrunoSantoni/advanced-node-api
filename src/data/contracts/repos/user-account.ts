export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace SaveUserAccountByFacebookRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }

  export type Result = undefined
}

export interface SaveUserAccountByFacebookRepository {
  saveWithFacebook: (params: SaveUserAccountByFacebookRepository.Params) => Promise<SaveUserAccountByFacebookRepository.Result>
}
