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

export namespace UpdateUserAccountByFacebookRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }

  export type Result = undefined
}

export interface UpdateUserAccountByFacebookRepository {
  updateWithFacebook: (params: UpdateUserAccountByFacebookRepository.Params) => Promise<UpdateUserAccountByFacebookRepository.Result>
}
