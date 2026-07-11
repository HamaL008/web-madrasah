import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default api
