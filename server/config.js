import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '8888',
  databaseUrl: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/lotus?sslmode=disable',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8888/api',
  env: process.env.NODE_ENV || 'development',
}
