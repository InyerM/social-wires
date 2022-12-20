import "reflect-metadata"
import app from './app'
import { serverConfig } from "./config"
import { AppDataSource } from './data'

async function main() {
  try {
    await AppDataSource.initialize()
    console.log('Database is connected')
  }
  catch (error) {
    console.log(error)
  }
  app.listen(serverConfig, () => {
    console.log(`Server is running in http://localhost:${serverConfig.port}`)
  })
}

main()