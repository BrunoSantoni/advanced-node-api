import './config/module-alias'

import 'reflect-metadata'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { createConnection } from 'typeorm'

createConnection() // Por default o createConnection procura o ormconfig.json na raíz.
  .then(() => app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`)))
  .catch(console.error)
