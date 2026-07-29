import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Loader from '@/components/ui/loader'
import { useState, useEffect, useRef } from 'react'
import { usersColumns } from './constants'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getUsersDetails,
  deleteUser,
  updateUser,
  createUser,
  downloadUsersExcel,
  getUserDetail,
} from '@/services/admin'
import { base64ToBlob, isDataUrl } from '@/lib/utils'
import useLookupQuery from '@/hooks/queries/useLookupQuery'
import Select from '../../components/ui/Select.jsx'

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewUser, setViewUser] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewTitle, setPreviewTitle] = useState('')

  const openPreview = (v, title) => {
    if (!v || v === '-') return
    if (isDataUrl(v) || /^([A-Za-z0-9+/=\-_\s]+)$/.test(v)) {
      try {
        let blob
        if (isDataUrl(v)) {
          blob = base64ToBlob(v)
        } else {
          const normalized = v
            .replace(/\s/g, '')
            .replace(/-/g, '+')
            .replace(/_/g, '/')
          blob = base64ToBlob('data:application/octet-stream;base64,' + normalized)
        }
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        setPreviewTitle(title)
        setPreviewOpen(true)
      } catch (e) {
        console.error('Failed to parse base64 document', e)
        window.alert('Failed to open document preview')
      }
    } else {
      setPreviewUrl(v)
      setPreviewTitle(title)
      setPreviewOpen(true)
    }
  }
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    email: '',
    nim: '',
    regionId: 0,
    lineId: '',
    whatsappNumber: '',
    facultyId: 0,
    majorId: 0,
    lntCourseId: 0,
    scheduleId: 0,
    status: '',
  })
  const [editLoading, setEditLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    nim: '',
    regionId: 0,
    lineId: '',
    whatsappNumber: '',
    facultyId: 0,
    majorId: 0,
    lntCourseId: 0,
    scheduleId: 0,
    isJapres: null,
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [showViewMessageModal, setShowViewMessageModal] = useState(false)

  const [whatsAppMessage, setWhatsAppMessage] = useState(
    `Haloo, {nama}! 👋

Jangan lewatkan Codesign BNCC 2026 untuk mendapatkan materi yang dapat mempersiapkan kamu sebagai seorang developer!

https://www.instagram.com/bnccbinus/

Best Regards,
Panitia BNCC Launching`,
  )
  const [tempWhatsAppMessage, setTempWhatsAppMessage] =
    useState(whatsAppMessage)

  const watchedRegionId = editForm.regionId
  const watchedFacultyId = editForm.facultyId

  const {
    regionQuery,
    facultyQuery,
    majorQuery,
    lntCourseQuery,
    scheduleQuery,
  } = useLookupQuery(watchedRegionId, watchedFacultyId)

  const watchedCreateRegionId = createForm.regionId
  const watchedCreateFacultyId = createForm.facultyId

  const {
    regionQuery: createRegionQuery,
    facultyQuery: createFacultyQuery,
    majorQuery: createMajorQuery,
    lntCourseQuery: createLntCourseQuery,
    scheduleQuery: createScheduleQuery,
  } = useLookupQuery(watchedCreateRegionId, watchedCreateFacultyId)

  const abortRef = useRef(null)

  const regions = regionQuery.data || []
  const faculties =
    facultyQuery.data?.filter(
      (faculty) => !faculty.regionId || Number(faculty.regionId) === Number(watchedRegionId),
    ) || []
  const majors =
    majorQuery.data?.filter(
      (major) => !major.facultyId || Number(major.facultyId) === Number(watchedFacultyId),
    ) || []
  const lntCourses =
    lntCourseQuery.data?.filter(
      (course) => !course.regionId || Number(course.regionId) === Number(watchedRegionId),
    ) || []
  const schedules =
    scheduleQuery.data?.filter(
      (schedule) => !schedule.regionId || Number(schedule.regionId) === Number(watchedRegionId),
    ) || []

  const createFaculties =
    createFacultyQuery.data?.filter(
      (faculty) => !faculty.regionId || Number(faculty.regionId) === Number(watchedCreateRegionId),
    ) || []
  const createMajors =
    createMajorQuery.data?.filter(
      (major) => !major.facultyId || Number(major.facultyId) === Number(watchedCreateFacultyId),
    ) || []
  const createLntCourses =
    createLntCourseQuery.data?.filter(
      (course) => !course.regionId || Number(course.regionId) === Number(watchedCreateRegionId),
    ) || []
  const createSchedules =
    createScheduleQuery.data?.filter(
      (schedule) => !schedule.regionId || Number(schedule.regionId) === Number(watchedCreateRegionId),
    ) || []

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['user-details'],
    queryFn: getUsersDetails,
  })

  useEffect(() => {
    if (isError) {
      setError(fetchError)
      setShowErrorModal(true)
    }
  }, [isError, fetchError])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const mutation = useMutation({
    mutationFn: (id) => {
      abortRef.current = new AbortController()
      return deleteUser(id, { signal: abortRef.current.signal })
    },
    onSuccess: () => {
      setDeleting(false)
      setShowDeleteModal(false)
      setAlert({ type: 'success', message: 'User deleted successfully.' })
      refetch()
    },
    onError: (err) => {
      setDeleting(false)
      setShowDeleteModal(false)
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'An unknown error occurred.',
      })
    },
  })

  const editMutation = useMutation({
    mutationFn: (form) => updateUser(form),
    onMutate: () => setEditLoading(true),
    onSuccess: () => {
      setEditLoading(false)
      setShowEditModal(false)
      setAlert({ type: 'success', message: 'User updated successfully.' })
      refetch()
    },
    onError: (err) => {
      setEditLoading(false)
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'An unknown error occurred.',
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: (form) => createUser(form),
    onMutate: () => setCreateLoading(true),
    onSuccess: () => {
      setCreateLoading(false)
      setShowCreateModal(false)
      setAlert({ type: 'success', message: 'User created successfully.' })
      refetch()
      setCreateForm({
        fullName: '',
        email: '',
        password: '',
        nim: '',
        regionId: 0,
        lineId: '',
        whatsappNumber: '',
        facultyId: 0,
        majorId: 0,
        lntCourseId: 0,
        scheduleId: 0,
        isJapres: null,
      })
    },
    onError: (err) => {
      setCreateLoading(false)
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'An unknown error occurred.',
      })
    },
  })

  const OpenWhatsApp = (number, text) => {
    const formatText = encodeURIComponent(text)
    window.open(`https://wa.me/+62${number}?text=${formatText}`)
  }

  const allData =
    data?.data?.map((user) => {
      const reg = user.registrations?.[0] || {}
      return {
        ID: user.id,
        'BNCC ID': reg.bnccId || '-',
        'Full Name': user.name || '-',
        Status: user.status || '-',
        Email: user.email || '-',
        LINE: reg.lineId || '-',
        WhatsApp: reg.whatsappNumber ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              const message = whatsAppMessage.replace('{nama}', user.name)
              OpenWhatsApp(reg.whatsappNumber, message)
            }}
            className="text-blue-600 underline"
          >
            {reg.whatsappNumber}
          </a>
        ) : (
          '-'
        ),
        NIM: reg.nim || '-',
        'LnT Course': reg.lntCourse?.title || '-',
        'Launching Schedule': reg.schedule?.title || '-',
        Major: reg.major?.name || '-',
        Faculty: reg.faculty?.name || '-',
        Region: reg.region?.name || '-',
        Actions: (
          <div className="flex flex-row justify-between">
            <button
              onClick={() => handleViewUser(user.id)}
              aria-label="View"
              className="mx-1"
            >
              <svg
                width={18}
                height={18}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setEditForm({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  nim: reg.nim,
                  lineId: reg.lineId,
                  whatsappNumber: reg.whatsappNumber,
                  regionId: reg.region?.id ?? 0,
                  facultyId: reg.faculty?.id ?? 0,
                  majorId: reg.major?.id ?? 0,
                  lntCourseId: reg.lntCourse?.id ?? 0,
                  scheduleId: reg.schedule?.id ?? 0,
                  status: user.status ?? '',
                })
                setShowEditModal(true)
              }}
              aria-label="Edit"
              className="mx-1"
            >
              <svg
                width={18}
                height={18}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M16.862 3.487a2.07 2.07 0 0 1 2.93 2.93l-1.1 1.1-2.93-2.93 1.1-1.1zm-2.1 2.1 2.93 2.93-9.1 9.1H5.662v-3.03l9.1-9.1z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setDeleteTarget(user.id)
                setShowDeleteModal(true)
              }}
              aria-label="Delete"
              className="mx-1"
            >
              <svg
                width={18}
                height={18}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 10v-6m4 6v-6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ),
      }
    }) ?? []

  const filteredData = searchQuery
    ? allData.filter((row) =>
        (row['Full Name'] || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : allData

  const pagedData = filteredData.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage,
  )

  const handleRetry = () => {
    setShowErrorModal(false)
    setError(null)
    refetch()
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setDeleting(true)
      mutation.mutate(deleteTarget)
    }
  }

  const handleAlertClose = () => setAlert(null)

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    editMutation.mutate(editForm)
  }

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value })
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(createForm)
  }

  const handleViewUser = async (userId) => {
    setViewLoading(true)
    try {
      const detail = await getUserDetail(String(userId))
      setViewUser(detail.data?.[0] ?? detail.data ?? null)
      setShowViewModal(true)
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to fetch user details.',
      })
      setShowViewModal(true)
    } finally {
      setViewLoading(false)
    }
  }

  const handleSaveWhatsAppMessage = () => {
    setWhatsAppMessage(tempWhatsAppMessage)
    setShowWhatsAppModal(false)
  }

  return (
    <div className={`py-6 space-y-7 ${deleting ? 'pointer-events-none' : ''}`}>
      {previewOpen && previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-[90%] max-h-[90%] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{previewTitle}</h3>
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-sm"
                onClick={() => {
                  setPreviewUrl(null)
                  setPreviewOpen(false)
                }}
              >
                Close
              </button>
            </div>
            {/* Fallback link for embedding issues */}
            <div className="text-xs text-gray-500 mb-2 text-center">
              Can't see the document? <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline cursor-pointer">Click here to open in a new tab</a>
            </div>
            <div className="flex-1 overflow-auto flex justify-center items-center bg-gray-100 p-2 rounded">
              {previewUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)/i.test(previewUrl) ? (
                <img
                  src={previewUrl}
                  alt={previewTitle}
                  className="max-h-[70vh] object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh]"
                  title={previewTitle}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-gray-600 mb-6">
              {error?.response?.data?.error ||
                error?.message ||
                'An unknown error occurred.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-left min-w-[350px] max-w-[90vw]">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            {viewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>
            ) : viewUser ? (
              <div className="space-y-2 mb-6">
                <div>
                  <b>Name:</b> {viewUser.name}
                </div>
                <div>
                  <b>Email:</b> {viewUser.email}
                </div>
                <div>
                  <b>Status:</b> {viewUser.status}
                </div>
                <div>
                  <b>Role:</b> {viewUser.role}
                </div>
                <div>
                  <b>Created At:</b> {viewUser.createdAt}
                </div>
                <div>
                  <b>Updated At:</b> {viewUser.updatedAt}
                </div>
                {viewUser.registrations?.map((reg, idx) => (
                  <div key={idx} className="border-t pt-2 mt-2">
                    <div>
                      <b>NIM:</b> {reg.nim}
                    </div>
                    <div>
                      <b>BNCC ID:</b> {reg.bnccId}
                    </div>
                    <div>
                      <b>LINE:</b> {reg.lineId}
                    </div>
                    <div>
                      <b>WhatsApp:</b> {reg.whatsappNumber}
                    </div>
                    <div>
                      <b>Region:</b> {reg.region?.name}
                    </div>
                    <div>
                      <b>Faculty:</b> {reg.faculty?.name}
                    </div>
                    <div>
                      <b>Major:</b> {reg.major?.name}
                    </div>
                    <div>
                      <b>LnT Course:</b> {reg.lntCourse?.title}
                    </div>
                    <div>
                      <b>Schedule:</b> {reg.schedule?.title}
                    </div>
                    <div>
                      <b>LinkedIn:</b>{' '}
                      {reg.linkedinUrl ? (
                        <a
                          href={reg.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          LinkedIn
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                    <div>
                      <b>Github:</b>{' '}
                      {reg.githubUrl ? (
                        <a
                          href={reg.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Github
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                    <div>
                      <b>Member Letter:</b>{' '}
                      {reg.suratMember && reg.suratMember !== '-' ? (
                        <button
                          onClick={() => openPreview(reg.suratMember, 'Member Letter')}
                          className="text-blue-600 underline cursor-pointer"
                        >
                          Member Letter
                        </button>
                      ) : (
                        '-'
                      )}
                    </div>
                    <div>
                      <b>Binusian Card:</b>{' '}
                      {reg.binusianCard && reg.binusianCard !== '-' ? (
                        <button
                          onClick={() => openPreview(reg.binusianCard, 'Binusian Card')}
                          className="text-blue-600 underline cursor-pointer"
                        >
                          Binusian Card
                        </button>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Could not load user details.</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setViewUser(null)
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded-lg shadow-xl text-left min-w-[350px] max-w-[600px] w-full"
            onSubmit={handleEditSubmit}
          >
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                name="name"
                value={editForm.name || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="Name"
                required
              />
              <input
                name="email"
                value={editForm.email || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="Email"
                required
              />
              <input
                name="nim"
                value={editForm.nim || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="NIM"
                required
              />
              <input
                name="lineId"
                value={editForm.lineId || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="LINE ID"
                required
              />
              <input
                name="whatsappNumber"
                value={editForm.whatsappNumber || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="WhatsApp"
                required
              />
              <Select
                value={editForm.regionId || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    regionId: val ? Number(val) : 0,
                    facultyId: 0,
                    majorId: 0,
                    lntCourseId: 0,
                    scheduleId: 0,
                  })
                }}
                options={regions.map((r) => ({ value: r.id, label: r.name }))}
                placeholder="Select Region"
              />
              <Select
                value={editForm.facultyId || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    facultyId: val ? Number(val) : 0,
                    majorId: 0,
                  })
                }}
                options={faculties.map((f) => ({ value: f.id, label: f.name }))}
                placeholder={!editForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select Faculty'}
                disabled={!editForm.regionId}
              />
              <Select
                value={editForm.majorId || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    majorId: val ? Number(val) : 0,
                  })
                }}
                options={majors.map((m) => ({ value: m.id, label: m.name }))}
                placeholder={!editForm.facultyId ? 'Pilih fakultas Anda terlebih dahulu' : 'Select Major'}
                disabled={!editForm.facultyId}
              />
              <Select
                value={editForm.lntCourseId || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    lntCourseId: val ? Number(val) : 0,
                  })
                }}
                options={lntCourses.map((l) => ({ value: l.id, label: l.title || l.name }))}
                placeholder={!editForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select LnT Course'}
                disabled={!editForm.regionId}
              />
              <Select
                value={editForm.scheduleId || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    scheduleId: val ? Number(val) : 0,
                  })
                }}
                options={schedules.map((s) => ({ value: s.id, label: s.title }))}
                placeholder={!editForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select Schedule'}
                disabled={!editForm.regionId}
              />
              <Select
                value={editForm.status || ''}
                onChange={(val) => {
                  setEditForm({
                    ...editForm,
                    status: val,
                  })
                }}
                options={[
                  { value: 'email_verified', label: 'Email Verified' },
                  { value: 'email_unverified', label: 'Email Unverified' },
                  { value: 'done_launching', label: 'Done Launching' },
                  { value: 'confirm_launching', label: 'Confirm Launching' },
                  { value: 'letter_error', label: 'Letter Error' },
                  { value: 'letter_verified', label: 'Letter Verified' },
                  { value: 'done_reregist', label: 'Done Re-Registration' },
                  { value: 'closed', label: 'Closed' },
                ]}
                placeholder="Select Status"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? <Loader /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded-lg shadow-xl text-left min-w-[350px] max-w-[600px] w-full"
            onSubmit={handleCreateSubmit}
          >
            <h3 className="text-xl font-bold mb-4">Create User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                name="fullName"
                value={createForm.fullName}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Full Name"
                required
              />
              <input
                name="email"
                value={createForm.email}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Email"
                required
              />
              <input
                name="password"
                type="password"
                value={createForm.password}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Password"
                required
              />
              <input
                name="nim"
                value={createForm.nim}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="NIM"
                required
              />
              <input
                name="lineId"
                value={createForm.lineId}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="LINE ID"
                required
              />
              <input
                name="whatsappNumber"
                value={createForm.whatsappNumber}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="WhatsApp"
                required
              />
              <Select
                value={createForm.regionId ?? ''}
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    regionId: val ? Number(val) : undefined,
                    facultyId: undefined,
                    majorId: undefined,
                    lntCourseId: undefined,
                    scheduleId: undefined,
                  })
                }}
                options={regions.map((r) => ({ value: r.id, label: r.name }))}
                placeholder="Select Region"
              />
              <Select
                value={createForm.facultyId ?? ''}
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    facultyId: val ? Number(val) : undefined,
                    majorId: undefined,
                  })
                }}
                options={createFaculties.map((f) => ({ value: f.id, label: f.name }))}
                placeholder={!createForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select Faculty'}
                disabled={!createForm.regionId}
              />
              <Select
                value={createForm.majorId ?? ''}
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    majorId: val ? Number(val) : undefined,
                  })
                }}
                options={createMajors.map((m) => ({ value: m.id, label: m.name }))}
                placeholder={!createForm.facultyId ? 'Pilih fakultas Anda terlebih dahulu' : 'Select Major'}
                disabled={!createForm.facultyId}
              />
              <Select
                value={createForm.lntCourseId ?? ''}
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    lntCourseId: val ? Number(val) : undefined,
                  })
                }}
                options={createLntCourses.map((l) => ({ value: l.id, label: l.title || l.name }))}
                placeholder={!createForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select LnT Course'}
                disabled={!createForm.regionId}
              />
              <Select
                value={createForm.scheduleId ?? ''}
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    scheduleId: val ? Number(val) : undefined,
                  })
                }}
                options={createSchedules.map((s) => ({ value: s.id, label: s.title }))}
                placeholder={!createForm.regionId ? 'Pilih region Anda terlebih dahulu' : 'Select Schedule'}
                disabled={!createForm.regionId}
              />
              <Select
                value={
                  createForm.isJapres !== null
                    ? String(createForm.isJapres)
                    : ''
                }
                onChange={(val) => {
                  setCreateForm({
                    ...createForm,
                    isJapres: val === '' ? null : Number(val),
                  })
                }}
                options={[
                  { value: '', label: 'None' },
                  { value: '-1', label: 'Pending' },
                  { value: '0', label: 'Rejected' },
                  { value: '1', label: 'Accepted Silver' },
                  { value: '2', label: 'Accepted Gold' },
                ]}
                placeholder="Select Jalur Prestasi"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={createLoading}
              >
                {createLoading ? <Loader /> : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-left w-full max-w-lg">
            <h3 className="text-xl font-bold mb-2">
              Set WhatsApp Message Template
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              The text{' '}
              <code className="bg-gray-200 p-1 rounded">{'{nama}'}</code> will
              be replaced with the user's full name.
            </p>
            <textarea
              className="w-full border p-2 rounded min-h-[200px]"
              value={tempWhatsAppMessage}
              onChange={(e) => setTempWhatsAppMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWhatsAppMessage}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-left w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              Current WhatsApp Message Template
            </h3>
            <div className="bg-gray-100 p-4 rounded border">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {whatsAppMessage}
              </pre>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewMessageModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user{' '}
              <span className="font-bold">{deleteTarget}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center">
            <Loader />
            <span className="mt-4 text-gray-700">Deleting user...</span>
          </div>
        </div>
      )}

      {alert && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[70]">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center">
            {alert.type === 'success' ? (
              <svg
                className="w-10 h-10 text-green-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-red-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="mb-4 text-lg font-semibold">
              {alert.type === 'success' ? 'Success' : 'Error'}
            </span>
            <span className="mb-4 text-gray-700">{alert.message}</span>
            <button
              onClick={handleAlertClose}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-row flex-wrap items-center gap-4 min-w-fit px-6">
        <input
          type="text"
          placeholder="Search by Full Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-2 px-4 w-full md:w-[400px] border rounded"
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
            type="button"
          >
            + Create User
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={() => {
              setTempWhatsAppMessage(whatsAppMessage)
              setShowWhatsAppModal(true)
            }}
            type="button"
          >
            Set WA Message
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setShowViewMessageModal(true)}
            type="button"
          >
            View WA Message
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-7 min-w-fit px-6">
        <div className="p-5 rounded-[8px] bg-white w-full">
          <Table
            columns={usersColumns}
            data={pagedData}
            loading={isLoading}
            striped={true}
            bordered={true}
            className="bg-white rounded-xl shadow-sm"
            tableFooter={
              <div
                className="w-full bg-white z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-4"
                style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.04)' }}
              >
                <Pagination
                  index={pageIndex}
                  totalItem={filteredData.length}
                  itemsPerPage={itemsPerPage}
                  optionItemPerPage={[5, 10, 25, 50, 100]}
                  onChangeIndex={setPageIndex}
                  onChangeItemsPerPage={(val) => {
                    setItemsPerPage(val)
                    setPageIndex(1)
                  }}
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                  onClick={downloadUsersExcel}
                  type="button"
                >
                  DOWNLOAD
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
