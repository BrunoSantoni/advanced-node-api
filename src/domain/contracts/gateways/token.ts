export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMinutes: number
  }

  export type Result = string
}

export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenValidator {
  export type Params = { token: string }
  export type Result = string
}

export interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}
