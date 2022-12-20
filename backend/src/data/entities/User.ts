import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    default: uuidv4()
  })
  id: string

  @Column()
  username: string
  
  @Column()
  email: string

  @Column()
  fullName: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}