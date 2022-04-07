export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace CreateUserAccountByFacebookRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }

  export type Result = undefined
}

export interface CreateUserAccountByFacebookRepository {
  createFromFacebook: (params: CreateUserAccountByFacebookRepository.Params) => Promise<CreateUserAccountByFacebookRepository.Result>
}
