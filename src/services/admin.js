import { AxiosError } from 'axios'
import api from './api'

// Errors
export const AdminNameError = {
  success: false,
  error: '',
}

export const Error = {
  error: '',
}

// Responses
export const AdminNameResponse = {
  success: false,
  name: '',
}

export const AdminOverviewResponse = {
  success: false,
  data: {
    totalPendaftar: 0,
    angkatan: {},
    lntClasses: [],
    jurusan: {
      totalJurusan: 0,
      top3: [],
    },
    statusLaunching: {
      count: 0,
      percentage: 0,
    },
    statusMember: {
      count: 0,
      percentage: 0,
    },
  },
}

export const UsersDetailResponse = {
  success: false,
  message: '',
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0,
  },
}

export const UserDetailResponse = {
  success: false,
  message: '',
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0,
  },
}

// Get Admin Name
export const getName = async () => {
  try {
    const response = await api.get('/admin/name', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      validateStatus: (status) => {
        if (status === 304) return false
        return status >= 200 && status < 300
      },
    })

    return response.data
  } catch (error) {
    throw error
  }
}

// Get Overview
export const getAdminOverview = async () => {
  // return {
  //   "success": true,
  //   "data": {
  //     "totalPendaftar": 100,
  //     "angkatan": {
  //       "B29": { "count": 40, "percentage": 40 },
  //       "B30": { "count": 60, "percentage": 60 }
  //     },
  //     "lntClasses": [
  //       { "className": "Kelas A", "count": 30, "percentage": 30 },
  //       { "className": "Kelas B", "count": 20, "percentage": 20 }
  //     ],
  //     "jurusan": {
  //       "totalJurusan": 10,
  //       "top3": [
  //         { "name": "Teknik Informatika", "count": 30 },
  //         { "name": "Sistem Informasi", "count": 20 },
  //         { "name": "Manajemen", "count": 15 }
  //       ]
  //     },
  //     "statusLaunching": { "count": 50, "percentage": 50 },
  //     "statusMember": { "count": 30, "percentage": 30 }
  //   }
  // }
  try {
    const response = await api.get('/admin/overview')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get User Details
export const getUsersDetails = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get User Detail By Id
export const getUserDetail = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete User By Id
export const deleteUser = async (id, p0) => {
  try {
    const response = await api.delete(`/admin/users/${id}`, {
      signal: p0?.signal,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

// Update User By Id
export const updateUser = async ({ id, ...payload }) => {
  const response = await api.patch(`/admin/users/${id}`, payload)
  return response.data
}

// Create User
export const createUser = async (data) => {
  const response = await api.post('/admin/users', data)
  return response.data
}

// Download Users Excel
export const downloadUsersExcel = async () => {
  try {
    const response = await api.get('/admin/export/users.xlsx', {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', 'users.xlsx')

    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    throw error
  }
}

// Get Payment Details
export const getPaymentDetails = async () => {
  // return {
  //   "success": true,
  //   "message": "Payment list retrieved",
  //   "data": [
  //     {
  //       "userId": 1,
  //       "name": "User Name",
  //       "region": "Kemanggisan",
  //       "bnccId": "BNCC26101",
  //       "is_japres": "Not Submitted",
  //       "payment_status": "PENDING",
  //       "order_id": null,
  //       "amount": 650000
  //     }
  //   ],
  //   "pagination": {
  //     "page": 1,
  //     "limit": 20,
  //     "total": 50,
  //     "totalPages": 3
  //   }
  // }
  try {
    const response = await api.get('/admin/payments')
    return response.data
  } catch (error) {
    throw error
  }
}

// Get Payment Proof
export const getPaymentProof = async (userId) => {
  try {
    const response = await api.get(`/admin/payments/proof/${userId}`, {
      responseType: 'arraybuffer',
    })

    return response.data
  } catch (error) {
    throw error
  }
}

// Update Payment Status
export const updatePaymentStatus = async (userId, payload) => {
  try {
    const response = await api.patch(`/admin/payments/${userId}`, payload)

    return response.data
  } catch (error) {
    throw error
  }
}

// Get Japres
export const getJapres = async () => {
  // return {
  //   "success": true,
  //   "message": "Japres details retrieved successfully",
  //   "data": [
  //     {
  //       "userId": 1,
  //       "email": "user@example.com",
  //       "name": "User Name",
  //       "region": "Kemanggisan",
  //       "japresUrl": "https://s3.bncc.net/...",
  //       "isJapres": null,
  //       "status": "Not Submitted",
  //       "submittedAt": null
  //     }
  //   ]
  // }
  try {
    const response = await api.get('/admin/japres')
    return response.data
  } catch (error) {
    throw error
  }
}

// Update Japres Status
export const updateJapresStatus = async (userId, isJapres) => {
  try {
    const response = await api.patch(`/admin/japres/${userId}`, { isJapres })

    return response.data
  } catch (error) {
    throw error
  }
}

// Download Japres Excel
export const downloadJapresExcel = async () => {
  try {
    const response = await api.get('/admin/export/japres.xlsx', {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', 'japres.xlsx')

    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    throw error
  }
}

// Get All Subscribers
export const getAllSubscribers = async () => {
  // return {
  //   "success": true,
  //   "data": [
  //     {
  //       "id": 1,
  //       "email": "user@example.com",
  //       "blastStatus": "SUCCESS",
  //       "blastTime": "2026-07-28T12:00:00.000Z"
  //     }
  //   ]
  // }
  try {
    const response = await api.get('/admin/subscribers')
    return response.data
  } catch (error) {
    throw error
  }
}

// Blast Email
export const blastEmail = async (delayMs) => {
  // return {
  //   "success": true,
  //   "message": "Blast started",
  //   "jobId": "blast-1712345678"
  // }
  try {
    const response = await api.post('/admin/blast-email', { delayMs })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET semua link dari backend
 */
export const getLinks = async () => {
  const response = await api.get('/admin/links');
  return response.data;
};

/**
 * GET link untuk user, difilter berdasarkan region & schedule
 */
export const getLinksByRegionAndSchedule = async ({
  regionId,
  scheduleId,
} = {}) => {
  const params = new URLSearchParams();
  if (regionId) params.set('regionId', regionId);
  if (scheduleId) params.set('scheduleId', scheduleId);
  const qs = params.toString();
  const response = await api.get(`/links${qs ? `?${qs}` : ''}`);
  return response.data;
};

/**
 * POST /api/admin/links
 * Creates a single link object in Prisma database
 */
export const createLink = async (payload) => {
  // payload: { regionId: number, name: string, tag: string, url: string }
  const response = await api.post('/admin/links', {
    regionId: Number(payload.regionId), // Pastikan bertipe Number
    name: payload.name,
    tag: payload.tag || 'ZOOM', // Sesuaikan dengan enum LinkTag backend kamu
    url: payload.url,
  });

  return response.data;
};