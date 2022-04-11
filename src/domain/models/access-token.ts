export class AccessToken {
  constructor (private readonly value: string) {}

  // Fazendo um getter para uma propriedade chamada expirationInMinutes,
  // pode acessar usando AccessToken.expirationInMinutes
  static get expirationInMinutes (): number {
    return 30
  }
}
