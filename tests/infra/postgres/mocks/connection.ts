import { IMemoryDb, newDb } from 'pg-mem'

export const makeFakePostgresDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database'
  })

  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()

  return db
}
