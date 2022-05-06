export namespace IDGenerator {
  export type Input = { key: string }
  export type Output = string
}

export interface IDGenerator {
  uuid: (input: IDGenerator.Input) => IDGenerator.Output
}
