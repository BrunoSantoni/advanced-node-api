import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'kesavan.db.elephantsql.com',
  port: 5432,
  username: 'wfszbzqd',
  database: 'wfszbzqd',
  password: 'mNwOKbSsCK6XZxpUVtyysjy4ElFoK4Mz',
  entities: ['dist/infra/postgres/entities/index.js']
}