export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMinutes: number
  }
}

export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<void>
}
