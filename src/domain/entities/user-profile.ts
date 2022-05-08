/* eslint-disable @typescript-eslint/no-non-null-assertion */
export class UserProfile {
  pictureUrl?: string
  initials?: string

  constructor (
    readonly id: string
  ) {}

  setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined && name !== '') {
      // Captura o primeiro caractere (.) depois de um espaço em branco (\b).
      const firstLetters = name.match(/\b(.)/g)!

      if (firstLetters.length <= 1) {
        this.initials = name.substring(0, 2).toUpperCase()

        return
      }

      this.initials = `${firstLetters.shift()!.toUpperCase()}${firstLetters.pop()!.toUpperCase()}`
    }
  }
}
