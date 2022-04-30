export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMinutes: number
  }

  export type Result = string
}

export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}