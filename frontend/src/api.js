import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Students
export const getStudents = (params) => api.get('/students', { params })
export const getStudent = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)

// Payments
export const getPayments = (params) => api.get('/payments', { params })
export const getStudentPayments = (id) => api.get(`/payments/student/${id}`)
export const recordPayment = (data) => api.post('/payments', data)
export const deletePayment = (id) => api.delete(`/payments/${id}`)

// Batches
export const getBatches = () => api.get('/batches')
export const getBatch = (id) => api.get(`/batches/${id}`)
export const createBatch = (data) => api.post('/batches', data)
export const updateBatch = (id, data) => api.put(`/batches/${id}`, data)
export const deleteBatch = (id) => api.delete(`/batches/${id}`)

// Reports
export const getReportSummary = (params) => api.get('/reports/summary', { params })
export const getMonthlyReport = () => api.get('/reports/monthly')
export const getDuesReport = (params) => api.get('/reports/dues', { params })

// Profile
export const getProfile = () => api.get('/profile')
export const updateProfile = (data) => api.put('/profile', data)

export default api
