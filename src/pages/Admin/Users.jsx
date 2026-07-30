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
import { base64ToBlob, isDataUrl, formatScheduleDisplay } from '@/lib/utils'
import useLookupQuery from '@/hooks/queries/useLookupQuery'

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('')
  const [majorFilter, setMajorFilter] = useState('')
  const [lntFilter, setLntFilter] = useState('')

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
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [bulkStatus, setBulkStatus] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)

  const [whatsAppMessage, setWhatsAppMessage] = useState(
    `Halo, {nama}!\n\nJangan lewatkan codesign BNCC 2025 untuk mendapatkan materi yang dapat mempersiapkan kamu sebagai seorang developers!\n\nhttps://www.instagram.com/bnccbinus/\n\nBest Regards,\nPanitia BNCC Launching`,
  )
  const [tempWhatsAppMessage, setTempWhatsAppMessage] =
    useState(whatsAppMessage)

  // CRASH PREVENTER: Helper function to safely render text (prevents React crashes from objects)
  const safeRender = (val) => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'object') {
      return val.name || val.title || JSON.stringify(val)
    }
    return String(val)
  }

  // Separate lookup query instances for edit form and create form
  const {
    regionQuery,
    facultyQuery,
    majorQuery,
    lntCourseQuery,
    scheduleQuery,
  } = useLookupQuery(
    editForm.regionId || undefined,
    editForm.facultyId || undefined,
  )

  const {
    regionQuery: createRegionQuery,
    facultyQuery: createFacultyQuery,
    majorQuery: createMajorQuery,
    lntCourseQuery: createLntCourseQuery,
    scheduleQuery: createScheduleQuery,
  } = useLookupQuery(
    createForm.regionId || undefined,
    createForm.facultyId || undefined,
  )

  const abortRef = useRef(null)

  const regions = regionQuery.data || []
  const faculties = (facultyQuery.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(editForm.regionId),
  )
  const majors = (majorQuery.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(editForm.facultyId),
  )
  const lntCourses = (lntCourseQuery.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(editForm.regionId),
  )
  const schedules = (scheduleQuery.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(editForm.regionId),
  )

  const createRegions = createRegionQuery.data || []
  const createFaculties = (createFacultyQuery.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(createForm.regionId),
  )
  const createMajors = (createMajorQuery.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(createForm.facultyId),
  )
  const createLntCourses = (createLntCourseQuery.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(createForm.regionId),
  )
  const createSchedules = (createScheduleQuery.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(createForm.regionId),
  )

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

  // Get unique options for filters from allData
  const uniqueFaculties = Array.from(
    new Set(
      allData.map((item) => item['Faculty']).filter((f) => f && f !== '-'),
    ),
  )
  const uniqueMajors = Array.from(
    new Set(allData.map((item) => item['Major']).filter((m) => m && m !== '-')),
  )
  const uniqueLnts = Array.from(
    new Set(
      allData.map((item) => item['LnT Course']).filter((l) => l && l !== '-'),
    ),
  )

  const filteredData = allData.filter((row) => {
    const matchSearch = searchQuery
      ? (row['Full Name'] || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
    const matchFaculty = facultyFilter ? row['Faculty'] === facultyFilter : true
    const matchMajor = majorFilter ? row['Major'] === majorFilter : true
    const matchLnt = lntFilter ? row['LnT Course'] === lntFilter : true

    return matchSearch && matchFaculty && matchMajor && matchLnt
  })

  const pagedData = filteredData.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage,
  )

  const isAllSelected =
    pagedData.length > 0 &&
    pagedData.every((row) => selectedUserIds.includes(row.ID))

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = pagedData.map((row) => row.ID)
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = pagedData.map((row) => row.ID)
      setSelectedUserIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId])
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedUserIds.length === 0) return
    setBulkLoading(true)
    try {
      await Promise.all(
        selectedUserIds.map((id) => updateUser({ id, status: bulkStatus })),
      )
      setSelectedUserIds([])
      setBulkStatus('')
      refetch()
      setAlert({
        type: 'success',
        message: 'Successfully updated status for selected users.',
      })
      setTimeout(() => setAlert(null), 3000)
    } catch (err) {
      console.error(err)
      setError(err)
      setShowErrorModal(true)
    } finally {
      setBulkLoading(false)
    }
  }

  const tableColumns = [
    {
      title: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      itemAlign: 'center',
      headerAlign: 'center',
      width: '40px',
      itemWrapper: (value, rowData) => {
        const isChecked = selectedUserIds.includes(rowData?.ID)
        return (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleSelectUser(rowData?.ID, e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        )
      },
    },
    ...usersColumns,
  ]

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
      {/* ══ ERROR MODAL ══ */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center border border-gray-200 max-w-md w-full mx-4">
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

      {/* ══ VIEW USER MODAL ══ */}
      {showViewModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-left min-w-[350px] max-w-[90vw] border border-gray-200">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            {viewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>
            ) : viewUser ? (
              <div className="space-y-2 mb-6">
                <div>
                  <b>Name:</b> {safeRender(viewUser?.name)}
                </div>
                <div>
                  <b>Email:</b> {safeRender(viewUser?.email)}
                </div>
                <div>
                  <b>Status:</b> {safeRender(viewUser?.status)}
                </div>
                <div>
                  <b>Role:</b> {safeRender(viewUser?.role)}
                </div>
                <div>
                  <b>Created At:</b> {safeRender(viewUser?.createdAt)}
                </div>
                <div>
                  <b>Updated At:</b> {safeRender(viewUser?.updatedAt)}
                </div>

                {/* Registrations Mapping */}
                {Array.isArray(viewUser?.registrations) ? (
                  viewUser.registrations.map((reg, idx) => (
                    <div key={idx} className="border-t pt-2 mt-2">
                      <div>
                        <b>NIM:</b> {safeRender(reg?.nim)}
                      </div>
                      <div>
                        <b>BNCC ID:</b> {safeRender(reg?.bnccId)}
                      </div>
                      <div>
                        <b>LINE:</b> {safeRender(reg?.lineId)}
                      </div>
                      <div>
                        <b>WhatsApp:</b> {safeRender(reg?.whatsappNumber)}
                      </div>
                      <div>
                        <b>Region:</b> {safeRender(reg?.region?.name)}
                      </div>
                      <div>
                        <b>Faculty:</b> {safeRender(reg?.faculty?.name)}
                      </div>
                      <div>
                        <b>Major:</b> {safeRender(reg?.major?.name)}
                      </div>
                      <div>
                        <b>LnT Course:</b> {safeRender(reg?.lntCourse?.title)}
                      </div>
                      <div>
                        <b>Schedule:</b> {safeRender(reg?.schedule?.title)}
                      </div>
                      <div>
                        <b>LinkedIn:</b>{' '}
                        {reg?.linkedinUrl ? (
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
                        {reg?.githubUrl ? (
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
                        {reg?.suratMember
                          ? (() => {
                              const v = reg.suratMember
                              if (typeof v !== 'string')
                                return <span>{safeRender(v)}</span>
                              if (
                                isDataUrl(v) ||
                                /^([A-Za-z0-9+\/=\-_\s]+)$/.test(v)
                              ) {
                                return (
                                  <button
                                    onClick={async () => {
                                      try {
                                        let blob
                                        if (isDataUrl(v)) blob = base64ToBlob(v)
                                        else {
                                          const normalized = v
                                            .replace(/\s/g, '')
                                            .replace(/-/g, '+')
                                            .replace(/_/g, '/')
                                          blob = base64ToBlob(
                                            'data:application/octet-stream;base64,' +
                                              normalized,
                                          )
                                        }
                                        const url = URL.createObjectURL(blob)
                                        window.open(url, '_blank')
                                        setTimeout(
                                          () => URL.revokeObjectURL(url),
                                          5000,
                                        )
                                      } catch (e) {
                                        console.error(
                                          'Failed to open member letter',
                                          e,
                                        )
                                        window.alert('Failed to open file')
                                      }
                                    }}
                                    className="text-blue-600 underline"
                                  >
                                    Member Letter
                                  </button>
                                )
                              }
                              return (
                                <a
                                  href={v}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  Member Letter
                                </a>
                              )
                            })()
                          : '-'}
                      </div>
                      <div>
                        <b>Binusian Card:</b>{' '}
                        {reg?.binusianCard
                          ? (() => {
                              const v = reg.binusianCard
                              if (typeof v !== 'string')
                                return <span>{safeRender(v)}</span>
                              if (
                                isDataUrl(v) ||
                                /^([A-Za-z0-9+\/=\-_\s]+)$/.test(v)
                              ) {
                                return (
                                  <button
                                    onClick={async () => {
                                      try {
                                        let blob
                                        if (isDataUrl(v)) blob = base64ToBlob(v)
                                        else {
                                          const normalized = v
                                            .replace(/\s/g, '')
                                            .replace(/-/g, '+')
                                            .replace(/_/g, '/')
                                          blob = base64ToBlob(
                                            'data:application/octet-stream;base64,' +
                                              normalized,
                                          )
                                        }
                                        const url = URL.createObjectURL(blob)
                                        window.open(url, '_blank')
                                        setTimeout(
                                          () => URL.revokeObjectURL(url),
                                          5000,
                                        )
                                      } catch (e) {
                                        console.error(
                                          'Failed to open binusian card',
                                          e,
                                        )
                                        window.alert('Failed to open file')
                                      }
                                    }}
                                    className="text-blue-600 underline"
                                  >
                                    Binusian Card
                                  </button>
                                )
                              }
                              return (
                                <a
                                  href={v}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  Binusian Card
                                </a>
                              )
                            })()
                          : '-'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-t border-gray-200 pt-3 mt-3 text-sm text-gray-500 italic">
                    No registrations found.
                  </div>
                )}
              </div>
            ) : (
              <p>Could not load user details.</p>
            )}
            <div className="flex justify-end mt-4">
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

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <form
            className="bg-white p-6 rounded-xl shadow-2xl text-left min-w-[350px] max-w-[600px] w-full mx-4 border border-gray-200"
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
              <select
                name="regionId"
                value={editForm.regionId || ''}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    regionId: Number(e.target.value),
                    facultyId: 0,
                    majorId: 0,
                    lntCourseId: 0,
                    scheduleId: 0,
                  })
                }}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                name="facultyId"
                value={editForm.facultyId || ''}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    facultyId: Number(e.target.value),
                    majorId: 0,
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!editForm.regionId}
              >
                <option value="">Select Faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <select
                name="majorId"
                value={editForm.majorId || ''}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    majorId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!editForm.facultyId}
              >
                <option value="">Select Major</option>
                {majors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                name="lntCourseId"
                value={editForm.lntCourseId || ''}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    lntCourseId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!editForm.regionId}
              >
                <option value="">Select LnT Course</option>
                {lntCourses.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              <select
                name="scheduleId"
                value={editForm.scheduleId || ''}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    scheduleId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!editForm.regionId}
              >
                <option value="">Select Schedule</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {formatScheduleDisplay(s)}
                  </option>
                ))}
              </select>
              <select
                name="status"
                value={editForm.status || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Status</option>
                <option value="email_verified">Email Verified</option>
                <option value="email_unverified">Email Unverified</option>
                <option value="done_launching">Done Launching</option>
                <option value="confirm_launching">Confirm Launching</option>
                <option value="letter_error">Letter Error</option>
                <option value="letter_verified">Letter Verified</option>
                <option value="done_reregist">Done Re-Registration</option>
                <option value="closed">Closed</option>
              </select>
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

      {/* ══ CREATE MODAL ══ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <form
            className="bg-white p-6 rounded-xl shadow-2xl text-left min-w-[350px] max-w-[600px] w-full mx-4 border border-gray-200"
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
              <select
                name="regionId"
                value={createForm.regionId ?? ''}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    regionId: Number(e.target.value),
                    facultyId: undefined,
                    majorId: undefined,
                    lntCourseId: undefined,
                    scheduleId: undefined,
                  })
                }}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Region</option>
                {createRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                name="facultyId"
                value={createForm.facultyId ?? ''}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    facultyId: Number(e.target.value),
                    majorId: undefined,
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!createForm.regionId}
              >
                <option value="">Select Faculty</option>
                {createFaculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <select
                name="majorId"
                value={createForm.majorId ?? ''}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    majorId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!createForm.facultyId}
              >
                <option value="">Select Major</option>
                {createMajors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                name="lntCourseId"
                value={createForm.lntCourseId ?? ''}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    lntCourseId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!createForm.regionId}
              >
                <option value="">Select LnT Course</option>
                {createLntCourses.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              <select
                name="scheduleId"
                value={createForm.scheduleId ?? ''}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    scheduleId: Number(e.target.value),
                  })
                }}
                className="border p-2 rounded w-full"
                required
                disabled={!createForm.regionId}
              >
                <option value="">Select Schedule</option>
                {createSchedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {formatScheduleDisplay(s)}
                  </option>
                ))}
              </select>
              <select
                name="isJapres"
                value={
                  createForm.isJapres !== null
                    ? String(createForm.isJapres)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value
                  setCreateForm({
                    ...createForm,
                    isJapres: val === '' ? null : Number(val),
                  })
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">None</option>
                <option value={-1}>Pending</option>
                <option value={0}>Rejected</option>
                <option value={1}>Accepted Silver</option>
                <option value={2}>Accepted Gold</option>
              </select>
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

      {/* ══ WHATSAPP MODALS ══ */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-left w-full max-w-lg mx-4 border border-gray-200">
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
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-left w-full max-w-lg mx-4 border border-gray-200">
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

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center border border-gray-200">
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

      {/* ══ LOADING OVERLAY ══ */}
      {deleting && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center flex flex-col items-center border border-gray-200">
            <Loader />
            <span className="mt-4 text-gray-700">Deleting user...</span>
          </div>
        </div>
      )}

      {/* ══ ALERT TOAST ══ */}
      {alert && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-start justify-center pt-20 pb-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center flex flex-col items-center border border-gray-200">
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

      {/* ══ MAIN TABLE LAYOUT ══ */}
      <div className="flex flex-row flex-wrap items-center gap-4 min-w-fit px-6">
        <input
          type="text"
          placeholder="Search by Full Name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPageIndex(1)
          }}
          className="py-2 px-4 w-full md:w-[250px] border rounded"
        />

        <select
          value={facultyFilter}
          onChange={(e) => {
            setFacultyFilter(e.target.value)
            setPageIndex(1)
          }}
          className="py-2 px-4 border rounded w-full md:w-auto min-w-[150px]"
        >
          <option value="">All Faculties</option>
          {uniqueFaculties.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={majorFilter}
          onChange={(e) => {
            setMajorFilter(e.target.value)
            setPageIndex(1)
          }}
          className="py-2 px-4 border rounded w-full md:w-auto min-w-[150px]"
        >
          <option value="">All Majors</option>
          {uniqueMajors.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={lntFilter}
          onChange={(e) => {
            setLntFilter(e.target.value)
            setPageIndex(1)
          }}
          className="py-2 px-4 border rounded w-full md:w-auto min-w-[150px]"
        >
          <option value="">All LnT Courses</option>
          {uniqueLnts.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center flex-wrap">
          {selectedUserIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mr-2">
              <span className="text-sm font-semibold text-blue-800">
                {selectedUserIds.length} selected
              </span>
              <select
                className="border p-1 text-sm rounded bg-white text-gray-700 font-medium"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="email_verified">Email Verified</option>
                <option value="email_unverified">Email Unverified</option>
                <option value="done_launching">Done Launching</option>
                <option value="confirm_launching">Confirm Launching</option>
                <option value="letter_error">Letter Error</option>
                <option value="letter_verified">Letter Verified</option>
                <option value="done_reregist">Done Re-Registration</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus || bulkLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50 font-medium cursor-pointer"
              >
                {bulkLoading ? 'Updating...' : 'Apply'}
              </button>
            </div>
          )}
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
            columns={tableColumns}
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
