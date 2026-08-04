import api from './api'

/**
 * Helper to extract error message cleanly from Axios responses
 */
const extractErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  )
}

/**
 * POST /auth/signup (or /register)
 * Registers a new user and returns detailed error responses if it fails.
 */
export const signUp = async (payload) => {
  try {
    const response = await api.post('/auth/signup', payload)
    return response.data
  } catch (error) {
    const message = extractErrorMessage(
      error,
      'Gagal mendaftar. Silakan periksa kembali data Anda.',
    )
    throw new Error(message)
  }
}

/**
 * POST /auth/login
 * Authenticates user and retrieves access token.
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    const message = extractErrorMessage(
      error,
      'Login gagal. Silakan periksa email dan password Anda.',
    )
    throw new Error(message)
  }
}

/**
 * GET /profile
 * Fetches current authenticated user profile data.
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    return response.data
  } catch (error) {
    const message = extractErrorMessage(error, 'Gagal mengambil data profil.')
    throw new Error(message)
  }
}

/**
 * PATCH /profile
 * Updates existing user profile details.
 */
export const updateProfile = async (payload) => {
  try {
    const response = await api.patch('/profile', payload)
    return response.data
  } catch (error) {
    const message = extractErrorMessage(error, 'Gagal memperbarui profil.')
    throw new Error(message)
  }
}

/**
 * POST /auth/forgot-password
 * Sends reset password email/link to user.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    const message = extractErrorMessage(
      error,
      'Gagal mengirim permintaan reset password.',
    )
    throw new Error(message)
  }
}

/**
 * POST /auth/reset-password
 * Resets password using token.
 */
export const resetPassword = async (payload) => {
  try {
    const response = await api.post('/auth/reset-password', payload)
    return response.data
  } catch (error) {
    const message = extractErrorMessage(error, 'Gagal mereset password.')
    throw new Error(message)
  }
}

/**
 * Helper: Removes tokens and logs user out locally
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('accessToken')
  sessionStorage.clear()
}
