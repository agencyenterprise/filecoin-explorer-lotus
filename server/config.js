import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8888',
  databaseUrl: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/lotus?sslmode=disable',
  databaseSSL: process.env.DATABASE_SSL || false,
  env: process.env.NODE_ENV || 'development',
}
