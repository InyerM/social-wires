import axios from 'axios'

const baseUrl = 'http://localhost:4000/api'

export const wiresApi = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
