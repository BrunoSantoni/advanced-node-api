import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'nome', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string

  @Column({ type: 'text', name: 'url_imagem', nullable: true })
  pictureUrl?: string | null

  @Column({ type: 'text', name: 'iniciais', nullable: true })
  initials?: string | null
}
