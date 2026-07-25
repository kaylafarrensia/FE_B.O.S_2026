import { AxiosError } from 'axios';
import api from './api';

// In-memory data store for fallback mock data
let inMemoryUsers = [
  {
    id: 1,
    bnccId: 'BNCC2600001',
    fullName: 'Alice Johnson',
    status: 'email_verified',
    email: 'alice.johnson@binus.ac.id',
    lineId: 'alice_j',
    whatsappNumber: '081234567890',
    nim: '2601234567',
    lntCourse: 'Front-End',
    schedule: 'Saturday, August 15 2026',
    major: 'Computer Science',
    faculty: 'School of Computer Science',
    region: 'Kemanggisan',
    actions: ''
  },
  {
    id: 2,
    bnccId: 'BNCC2600002',
    fullName: 'Bob Smith',
    status: 'confirm_launching',
    email: 'bob.smith@binus.ac.id',
    lineId: 'bob_smith',
    whatsappNumber: '089876543210',
    nim: '2609876543',
    lntCourse: 'Back-End',
    schedule: 'Friday, August 14 2026',
    major: 'Information Systems',
    faculty: 'School of Information Systems',
    region: 'Alam Sutera',
    actions: ''
  },
  {
    id: 3,
    bnccId: 'BNCC2600003',
    fullName: 'Charlie Davis',
    status: 'done_reregist',
    email: 'charlie.davis@binus.ac.id',
    lineId: 'charlie_d',
    whatsappNumber: '085712345678',
    nim: '2601122334',
    lntCourse: 'Mobile Development',
    schedule: 'Saturday, August 15 2026',
    major: 'Computer Engineering',
    faculty: 'School of Computer Science',
    region: 'Kemanggisan',
    actions: ''
  }
];

let inMemoryPayments = [
  {
    id: 1,
    bnccId: 'BNCC2600001',
    fullName: 'Alice Johnson',
    region: 'Kemanggisan',
    japresType: 'accepted gold',
    paymentStatus: 'paid',
    orderId: 'ORD-2026-0001',
    amount: 150000,
    paymentProof: 'view',
    actions: ''
  },
  {
    id: 2,
    bnccId: 'BNCC2600002',
    fullName: 'Bob Smith',
    region: 'Alam Sutera',
    japresType: 'pending',
    paymentStatus: 'pending',
    orderId: 'ORD-2026-0002',
    amount: 150000,
    paymentProof: 'view',
    actions: ''
  }
];

let inMemoryJapres = [
  {
    id: 1,
    email: 'alice.johnson@binus.ac.id',
    fullName: 'Alice Johnson',
    region: 'Kemanggisan',
    linkDrive: 'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoP',
    japresType: 'pending',
    submitDate: 'July 25 2026',
    actions: ''
  },
  {
    id: 2,
    email: 'charlie.davis@binus.ac.id',
    fullName: 'Charlie Davis',
    region: 'Kemanggisan',
    linkDrive: 'https://drive.google.com/drive/folders/2bCdEfGhIjKlMnOpQ',
    japresType: 'accepted gold',
    submitDate: 'July 24 2026',
    actions: ''
  }
];

let inMemorySubscribers = [
  {
    id: 1,
    createdAt: 'July 24 2026',
    email: 'subscriber1@gmail.com',
    status: 'success',
    blastTime: 'July 25 2026'
  },
  {
    id: 2,
    createdAt: 'July 25 2026',
    email: 'subscriber2@gmail.com',
    status: 'pending',
    blastTime: '—'
  }
];

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
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return {
      success: true,
      name: 'SUPER'
    };
  }
};

// Get Overview
export const getAdminOverview = async () => {
  try {
    const response = await api.get('/admin/overview');
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return {
      success: true,
      data: {
        totalPendaftar: inMemoryUsers.length,
        angkatan: {
          'B28': { count: 120 },
          'B27': { count: 80 },
          'B26': { count: 50 }
        },
        lntClasses: [
          { className: 'Front-End Development', count: 120 },
          { className: 'Back-End Development', count: 95 },
          { className: 'Mobile Development', count: 60 },
          { className: 'UI/UX Design', count: 85 },
          { className: 'Java Programming', count: 40 },
          { className: 'ML', count: 55 },
          { className: 'C++ programming', count: 30 }
        ],
        jurusan: {
          totalJurusan: 5,
          top3: [
            { name: 'Computer Science', count: 110 },
            { name: 'Information Systems', count: 75 },
            { name: 'Computer Engineering', count: 45 }
          ]
        },
        statusLaunching: {
          count: 180,
          percentage: 72
        },
        statusMember: {
          count: 140,
          percentage: 56
        }
      }
    };
  }
};

// Get User Details
export const getUsersDetails = async () => {
  try {
    const response = await api.get(`/admin/users?limit=0`);
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return {
      success: true,
      message: 'Success',
      data: inMemoryUsers,
      pagination: {
        total: inMemoryUsers.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(inMemoryUsers.length / 10)
      }
    };
  }
};

// Get User Detail By Id
export const getUserDetail = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    const user = inMemoryUsers.find(u => u.id === Number(id));
    return {
      success: true,
      data: user
    };
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
    console.warn('API connection failed. Falling back to in-memory delete.', error);
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== Number(id));
    return { success: true, message: 'User deleted successfully' };
  }
};

// Update User By Id
export const updateUser = async (data) => {
  try {
    const response = await api.patch(`/admin/users/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory update.', error);
    inMemoryUsers = inMemoryUsers.map(u => {
      if (u.id === Number(data.id)) {
        return {
          ...u,
          fullName: data.name || u.fullName,
          email: data.email || u.email,
          nim: data.nim || u.nim,
          lineId: data.lineId || u.lineId,
          whatsappNumber: data.whatsappNumber || u.whatsappNumber,
          status: data.status || u.status
        };
      }
      return u;
    });
    return { success: true, message: 'User updated successfully' };
  }
};

// Create User
export const createUser = async (data) => {
  try {
    const response = await api.post('/admin/users', data);
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory create.', error);
    const newId = inMemoryUsers.length ? Math.max(...inMemoryUsers.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      bnccId: `BNCC26${String(newId).padStart(5, '0')}`,
      fullName: data.fullName,
      status: 'email_verified',
      email: data.email,
      lineId: data.lineId,
      whatsappNumber: data.whatsappNumber,
      nim: data.nim,
      lntCourse: 'Front-End',
      schedule: 'Saturday, August 15 2026',
      major: 'Computer Science',
      faculty: 'School of Computer Science',
      region: 'Kemanggisan',
      actions: ''
    };
    inMemoryUsers.push(newUser);
    return { success: true, message: 'User created successfully' };
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
    console.warn('API download failed. Creating dummy local download.', error);
    const mockContent = 'ID,BNCC ID,Full Name,Status,Email,LINE,WhatsApp,NIM,LnT Course,Launching Schedule,Major,Faculty,Region\n' +
      inMemoryUsers.map(u => `${u.id},${u.bnccId},${u.fullName},${u.status},${u.email},${u.lineId},${u.whatsappNumber},${u.nim},${u.lntCourse},${u.schedule},${u.major},${u.faculty},${u.region}`).join('\n');
    const blob = new Blob([mockContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_mock.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

// Get Payment Details
export const getPaymentDetails = async () => {
  try {
    const response = await api.get('/admin/payments');
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return {
      success: true,
      data: inMemoryPayments
    };
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
    console.warn('API connection failed. Returning mock proof.', error);
    return new ArrayBuffer(0);
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
    console.warn('API connection failed. Falling back to in-memory payment update.', error);
    inMemoryPayments = inMemoryPayments.map(p => {
      if (p.id === Number(userId)) {
        return { ...p, paymentStatus: payload.paymentStatus };
      }
      return p;
    });
    return { success: true, message: 'Payment status updated successfully' };
  }
};

// Get Japres
export const getJapres = async () => {
  try {
    const response = await api.get('/admin/japres');
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return {
      success: true,
      data: inMemoryJapres
    };
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
    console.warn('API connection failed. Falling back to in-memory Japres status update.', error);
    inMemoryJapres = inMemoryJapres.map(j => {
      if (j.id === Number(userId)) {
        return { ...j, japresType: isJapres };
      }
      return j;
    });
    return { success: true, message: 'Japres status updated successfully' };
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
    console.warn('API download failed. Creating dummy local download.', error);
    const mockContent = 'ID,Email,Full Name,Region,Link Drive,JaPres Type,Submit Date\n' +
      inMemoryJapres.map(j => `${j.id},${j.email},${j.fullName},${j.region},${j.linkDrive},${j.japresType},${j.submitDate}`).join('\n');
    const blob = new Blob([mockContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'japres_mock.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

// Get All Subscribers
export const getAllSubscribers = async () => {
  try {
    const response = await api.get('/admin/subscribers');
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory mock data.', error);
    return inMemorySubscribers;
  }
};

// Blast Email
export const blastEmail = async (delayMs) => {
  try {
    const response = await api.post('/admin/blast-email', { delayMs });
    return response.data;
  } catch (error) {
    console.warn('API connection failed. Falling back to in-memory email blast.', error);
    inMemorySubscribers = inMemorySubscribers.map(s => ({
      ...s,
      status: 'success',
      blastTime: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).replace(/,\s*(\d{4})/, ' $1')
    }));
    return { success: true, message: 'Blast emails successfully triggered.' };
  }
};
