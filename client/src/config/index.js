import 'dotenv/config'

export default {
  apiUrl: process.env.REACT_APP_API_URL || `${window.location.origin}/api`,
}
