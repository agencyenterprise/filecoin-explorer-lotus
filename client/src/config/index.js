import dotenv from 'dotenv'

dotenv.config()

export const config = {
  apiUrl: process.env.REACT_APP_API_URL || `${window.location.origin}/api`,
}
