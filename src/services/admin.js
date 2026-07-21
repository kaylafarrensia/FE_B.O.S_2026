import { AxiosError } from 'axios';
import api from './api';

// Errors
export const AdminNameError = {
  success: false,
  error: ''
};

export const Error = {
  error: ''
};

// Responses
export const AdminNameResponse = {
  success: false,
  name: ''
};

export const AdminOverviewResponse = {
  success: false,
  data: {
    totalPendaftar: 0,
    angkatan: {},
    lntClasses: [],
    jurusan: {
      totalJurusan: 0,
      top3: []
    },
    statusLaunching: {
      count: 0,
      percentage: 0
    },
    statusMember: {
      count: 0,
      percentage: 0
    }
  }
};

export const UsersDetailResponse = {
  success: false,
  message: '',
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0
  }
};

export const UserDetailResponse = {
  success: false,
  message: '',
  data: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0
  }
};

// Get Admin Name
export const getName = async () => {
  try {
    const response = await api.get('/admin/name', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      validateStatus: (status) => {
        if (status === 304) return false;
        return status >= 200 && status < 300;
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Overview
export const getAdminOverview = async () => {
  try {
    const response = await api.get('/admin/overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get User Details
export const getUsersDetails = async () => {
  try {
    const response = await api.get(`/admin/users?limit=0`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get User Detail By Id
export const getUserDetail = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete User By Id
export const deleteUser = async (id, p0) => {
  try {
    const response = await api.delete(`/admin/users/${id}`, {
      signal: p0?.signal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update User By Id
export const updateUser = async (data) => {
  try {
    const response = await api.patch(`/admin/users/${data.id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create User
export const createUser = async (data) => {
  try {
    const response = await api.post('/admin/users', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Download Users Excel
export const downloadUsersExcel = async () => {
  try {
    const response = await api.get('/admin/export/users.xlsx', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'users.xlsx');

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw error;
  }
};

// Get Payment Details
export const getPaymentDetails = async () => {
  try {
    const response = await api.get('/admin/payments');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Payment Proof
export const getPaymentProof = async (userId) => {
  try {
    const response = await api.get(`/admin/payments/proof/${userId}`, {
      responseType: 'arraybuffer',
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Payment Status
export const updatePaymentStatus = async (userId, payload) => {
  try {
    const response = await api.patch(
      `/admin/payments/${userId}`,
      payload
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Japres
export const getJapres = async () => {
  try {
    const response = await api.get('/admin/japres');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Japres Status
export const updateJapresStatus = async (userId, isJapres) => {
  try {
    const response = await api.patch(
      `/admin/japres/${userId}`,
      { isJapres }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Download Japres Excel
export const downloadJapresExcel = async () => {
  try {
    const response = await api.get('/admin/export/japres.xlsx', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'japres.xlsx');

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw error;
  }
};

// Get All Subscribers
export const getAllSubscribers = async () => {
  try {
    const response = await api.get('/admin/subscribers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Blast Email
export const blastEmail = async (delayMs) => {
  try {
    const response = await api.post('/admin/blast-email', { delayMs });
    return response.data;
  } catch (error) {
    throw error;
  }
};
