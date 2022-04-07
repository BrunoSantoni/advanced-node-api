export namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    facebookId: string
    email: string
    name: string
  }
}

export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}
