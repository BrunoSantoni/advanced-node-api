import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '..', 'routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async (file) => {
      const { route } = await import(`../routes/${file}`)

      route(router)
    })

  app.use(router)
}
