import { DataSource } from 'typeorm' 
import { databaseConfig } from '../config'
import { User, Message } from './entities'

const { host, port, username, password, database } = databaseConfig

export const AppDataSource = new DataSource({
  type: "postgres",
  host,
  port,
  username,
  password,
  database,
  entities: [User, Message],
  synchronize: true,
  logging: true
})