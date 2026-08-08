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

// ── Robust WhatsApp URL Helper ───────────────────────────────────────────────
const OpenWhatsApp = (number, text) => {
  if (!number) return

  // 1. Strip all non-digit characters
  let cleanNumber = String(number).replace(/\D/g, '')

  // 2. Handle country code formatting cleanly
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.slice(1)
  } else if (!cleanNumber.startsWith('62')) {
    cleanNumber = '62' + cleanNumber
  }

  // 3. Encode the message payload
  const formatText = encodeURIComponent(text || '')

  // 4. Trigger window open
  window.open(`https://wa.me/${cleanNumber}?text=${formatText}`, '_blank')
}

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
  const [showEditModal, setShowEditModal] = useState(false)

  // ── Cross-Page Selection & Bulk Status State ──
  const [selectedUserIds, setSelectedUserIds] = useState(new Set())
  const [bulkStatus, setBulkStatus] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)

  // ── WA Blast Modal & State ──
  const [showBlastModal, setShowBlastModal] = useState(false)
  const [blastScope, setBlastScope] = useState('all_pages') // 'all_pages' | 'selected' | 'current_page'
  const [blastStatusFilter, setBlastStatusFilter] = useState('all') // 'all' or specific status
  const [blastLoading, setBlastLoading] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    email: '',
    binusEmail: '',
    nim: '',
    regionId: '',
    lineId: '',
    whatsappNumber: '',
    facultyId: '',
    majorId: '',
    lntCourseId: '',
    scheduleId: '',
    status: '',
  })
  const [editLoading, setEditLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Create form state
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    binusEmail: '',
    password: '',
    nim: '',
    regionId: '',
    lineId: '',
    whatsappNumber: '',
    facultyId: '',
    majorId: '',
    lntCourseId: '',
    scheduleId: '',
    isJapres: null,
    status: '',
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [showViewMessageModal, setShowViewMessageModal] = useState(false)

  const [whatsAppMessage, setWhatsAppMessage] = useState(
    `Halo, {nama}!

Jangan lewatkan codesign BNCC 2026 untuk mendapatkan materi yang dapat mempersiapkan kamu sebagai seorang developers!

Best Regards,
Panitia BNCC Launching`,
  )
  const [tempWhatsAppMessage, setTempWhatsAppMessage] =
    useState(whatsAppMessage)

  // Lookup queries with safe fallbacks
  const editLookup =
    useLookupQuery(
      Number(editForm.regionId) > 0 ? Number(editForm.regionId) : undefined,
      Number(editForm.facultyId) > 0 ? Number(editForm.facultyId) : undefined,
    ) || {}

  const createLookup =
    useLookupQuery(
      Number(createForm.regionId) > 0 ? Number(createForm.regionId) : undefined,
      Number(createForm.facultyId) > 0
        ? Number(createForm.facultyId)
        : undefined,
    ) || {}

  const abortRef = useRef(null)

  const regions = editLookup.regionQuery?.data || []
  const faculties = (editLookup.facultyQuery?.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(editForm.regionId),
  )
  const majors = (editLookup.majorQuery?.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(editForm.facultyId),
  )
  const lntCourses = (editLookup.lntCourseQuery?.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(editForm.regionId),
  )
  const schedules = (editLookup.scheduleQuery?.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(editForm.regionId),
  )

  const createRegions = createLookup.regionQuery?.data || []
  const createFaculties = (createLookup.facultyQuery?.data || []).filter(
    (f) => !f.regionId || Number(f.regionId) === Number(createForm.regionId),
  )
  const createMajors = (createLookup.majorQuery?.data || []).filter(
    (m) => !m.facultyId || Number(m.facultyId) === Number(createForm.facultyId),
  )
  const createLntCourses = (createLookup.lntCourseQuery?.data || []).filter(
    (c) => !c.regionId || Number(c.regionId) === Number(createForm.regionId),
  )
  const createSchedules = (createLookup.scheduleQuery?.data || []).filter(
    (s) => !s.regionId || Number(s.regionId) === Number(createForm.regionId),
  )

  // ── USER DETAILS QUERY ────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['user-details', pageIndex, itemsPerPage, searchQuery],
    queryFn: () => {
      try {
        return getUsersDetails({
          page: pageIndex,
          limit: itemsPerPage,
          search: searchQuery,
        })
      } catch (e) {
        return getUsersDetails()
      }
    },
  })

  // Safely extract raw user array from any response shape
  const rawUsers = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.users)
        ? data.users
        : []

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

  // ── Checkbox Selection Handlers ──
  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAllOnCurrentPage = (pageUsers) => {
    const pageUserIds = pageUsers.map((u) => u.id).filter(Boolean)
    const allSelected = pageUserIds.every((id) => selectedUserIds.has(id))

    setSelectedUserIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        pageUserIds.forEach((id) => next.delete(id))
      } else {
        pageUserIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  // ── Bulk Status Update Mutation ──
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }) => {
      const promises = Array.from(ids).map((id) => updateUser({ id, status }))
      return Promise.all(promises)
    },
    onMutate: () => setBulkLoading(true),
    onSuccess: () => {
      setBulkLoading(false)
      setAlert({
        type: 'success',
        message: `Successfully updated status for ${selectedUserIds.size} users.`,
      })
      setSelectedUserIds(new Set())
      setBulkStatus('')
      refetch()
    },
    onError: (err) => {
      setBulkLoading(false)
      const msg = err?.response?.data?.message
      const backendError = Array.isArray(msg) ? msg.join(', ') : msg
      setAlert({
        type: 'error',
        message:
          backendError ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to perform bulk status update.',
      })
    },
  })

  const handleBulkStatusSubmit = () => {
    if (!bulkStatus) {
      setAlert({ type: 'error', message: 'Please select a status to apply.' })
      return
    }
    if (selectedUserIds.size === 0) {
      setAlert({ type: 'error', message: 'No users selected.' })
      return
    }

    bulkStatusMutation.mutate({
      ids: selectedUserIds,
      status: bulkStatus,
    })
  }

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
    mutationFn: (form) => {
      const payload = {
        ...form,
        whatsappNumber: String(form.whatsappNumber || '')
          .trim()
          .slice(0, 13),
        binusEmail: form.binusEmail?.trim(),
        regionId: Number(form.regionId),
        facultyId: Number(form.facultyId),
        majorId: Number(form.majorId),
        lntCourseId: Number(form.lntCourseId),
        scheduleId: Number(form.scheduleId),
      }
      return updateUser(payload)
    },
    onMutate: () => setEditLoading(true),
    onSuccess: () => {
      setEditLoading(false)
      setShowEditModal(false)
      setAlert({ type: 'success', message: 'User updated successfully.' })
      refetch()
    },
    onError: (err) => {
      setEditLoading(false)
      const msg = err?.response?.data?.message
      const backendError = Array.isArray(msg) ? msg.join(', ') : msg
      setAlert({
        type: 'error',
        message:
          backendError ||
          err?.response?.data?.error ||
          err?.message ||
          'An unknown error occurred.',
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: (form) => {
      const bEmail = String(form.binusEmail || '').trim()
      const payload = {
        fullName: String(form.fullName || '').trim(),
        name: String(form.fullName || '').trim(),
        email: String(form.email || '').trim(),
        binusEmail: bEmail,
        password: String(form.password || ''),
        nim: String(form.nim || '').trim(),
        lineId: String(form.lineId || '').trim(),
        whatsappNumber: String(form.whatsappNumber || '')
          .trim()
          .slice(0, 13),
        regionId: Number(form.regionId),
        facultyId: Number(form.facultyId),
        majorId: Number(form.majorId),
        lntCourseId: Number(form.lntCourseId),
        scheduleId: Number(form.scheduleId),
        confirmPassword: String(form.password || ''),
        status: form.status || 'email_unverified',
        heardFrom: null,
      }

      if (
        form.isJapres !== null &&
        form.isJapres !== undefined &&
        form.isJapres !== ''
      ) {
        const val = Number(form.isJapres)
        payload.isJapres = val === -1 ? 0 : val
      } else {
        payload.isJapres = 0
      }

      return createUser(payload)
    },
    onMutate: () => setCreateLoading(true),
    onSuccess: () => {
      setCreateLoading(false)
      setShowCreateModal(false)
      setAlert({ type: 'success', message: 'User created successfully.' })
      refetch()
      setCreateForm({
        fullName: '',
        email: '',
        binusEmail: '',
        password: '',
        nim: '',
        regionId: '',
        lineId: '',
        whatsappNumber: '',
        facultyId: '',
        majorId: '',
        lntCourseId: '',
        scheduleId: '',
        isJapres: null,
        status: '',
      })
    },
    onError: (err) => {
      setCreateLoading(false)
      const msg = err?.response?.data?.message
      const backendError = Array.isArray(msg) ? msg.join(', ') : msg
      setAlert({
        type: 'error',
        message:
          backendError ||
          err?.response?.data?.error ||
          err?.message ||
          'An unknown error occurred.',
      })
    },
  })

  // ── MULTI-PAGE BLAST WA EXECUTION HANDLER (FIXED FOR POPUP BLOCKERS) ──
  const handleExecuteBlast = async () => {
    setBlastLoading(true)

    try {
      let targetPool = []

      if (blastScope === 'selected') {
        targetPool = rawUsers.filter((u) => selectedUserIds.has(u.id))
      } else if (blastScope === 'current_page') {
        targetPool = rawUsers
      } else if (blastScope === 'all_pages') {
        const allPagesResponse = await getUsersDetails({
          page: 1,
          limit: 10000,
          search: searchQuery,
        })

        targetPool = Array.isArray(allPagesResponse)
          ? allPagesResponse
          : Array.isArray(allPagesResponse?.data)
            ? allPagesResponse.data
            : Array.isArray(allPagesResponse?.users)
              ? allPagesResponse.users
              : []
      }

      // Filter pool by status if specified
      if (blastStatusFilter !== 'all') {
        targetPool = targetPool.filter(
          (user) =>
            String(user?.status).toLowerCase() ===
            String(blastStatusFilter).toLowerCase(),
        )
      }

      // Filter only users with valid WhatsApp numbers
      const usersWithWA = targetPool.filter((u) => {
        const reg =
          (Array.isArray(u?.registrations) ? u?.registrations[0] : null) ||
          u?.registration ||
          {}
        return !!reg?.whatsappNumber
      })

      if (usersWithWA.length === 0) {
        setAlert({
          type: 'error',
          message:
            'No matching users with valid WhatsApp numbers were found for the selected criteria.',
        })
        setBlastLoading(false)
        setShowBlastModal(false)
        return
      }

      setShowBlastModal(false)

      // Open tab windows sequentially with clean sanitization
      usersWithWA.forEach((user, idx) => {
        const reg =
          (Array.isArray(user?.registrations)
            ? user?.registrations[0]
            : null) ||
          user?.registration ||
          {}
        const message = whatsAppMessage.replace('{nama}', user?.name || '')
        setTimeout(() => {
          OpenWhatsApp(reg.whatsappNumber, message)
        }, idx * 600) // 600ms gap gives the browser UI breathing room to prevent throttle blocks
      })

      setAlert({
        type: 'success',
        message: `Triggered WhatsApp messaging for ${usersWithWA.length} users!`,
      })
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to fetch full user list for WhatsApp Blast.',
      })
    } finally {
      setBlastLoading(false)
    }
  }

  // Map raw users into table row objects safely
  const allRows = rawUsers.map((user) => {
    const reg =
      (Array.isArray(user?.registrations) ? user?.registrations[0] : null) ||
      user?.registration ||
      user?.registrations ||
      {}

    const extractedBinusEmail =
      user?.binus_email ||
      reg?.binus_email ||
      user?.binusEmail ||
      reg?.binusEmail ||
      user?.binusianEmail ||
      reg?.binusianEmail ||
      user?.email_binus ||
      reg?.email_binus ||
      '-'

    const nimValue = reg?.nim || user?.nim || ''
    const userId = user?.id

    return {
      Select: (
        <input
          type="checkbox"
          checked={selectedUserIds.has(userId)}
          onChange={() => toggleSelectUser(userId)}
          className="w-4 h-4 cursor-pointer accent-blue-600"
        />
      ),
      ID: user?.id ?? '-',
      'BNCC ID': reg?.bnccId || '-',
      'Full Name': user?.name || '-',
      Status: user?.status || '-',
      Email: user?.email || '-',
      'Binus Email': extractedBinusEmail,
      'Binusian Email': extractedBinusEmail,
      LINE: reg?.lineId || '-',
      WhatsApp: reg?.whatsappNumber ? (
        <span
          onClick={() => {
            const message = whatsAppMessage.replace('{nama}', user?.name || '')
            OpenWhatsApp(reg.whatsappNumber, message)
          }}
          className="text-blue-600 underline cursor-pointer"
        >
          {reg.whatsappNumber}
        </span>
      ) : (
        '-'
      ),
      NIM: nimValue || '-',
      'LnT Course': reg?.lntCourse?.title || reg?.lntCourse?.name || '-',
      'Launching Schedule': reg?.schedule?.title || reg?.schedule?.name || '-',
      Major: reg?.major?.name || '-',
      Faculty: reg?.faculty?.name || '-',
      Region: reg?.region?.name || '-',
      Actions: (
        <div className="flex flex-row justify-between">
          <button
            onClick={() => handleViewUser(user?.id)}
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
                id: user?.id ?? 0,
                name: user?.name || '',
                email: user?.email || '',
                binusEmail:
                  extractedBinusEmail !== '-' ? extractedBinusEmail : '',
                nim: nimValue || '',
                lineId: reg?.lineId || '',
                whatsappNumber: reg?.whatsappNumber || '',
                regionId: reg?.region?.id ?? '',
                facultyId: reg?.faculty?.id ?? '',
                majorId: reg?.major?.id ?? '',
                lntCourseId: reg?.lntCourse?.id ?? '',
                scheduleId: reg?.schedule?.id ?? '',
                status: user?.status ?? '',
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
              setDeleteTarget(user?.id)
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
  })

  // Add Dynamic Selection Column to Column List
  const updatedColumns = [
    {
      Header: (
        <input
          type="checkbox"
          checked={
            rawUsers.length > 0 &&
            rawUsers.every((u) => selectedUserIds.has(u.id))
          }
          onChange={() => toggleSelectAllOnCurrentPage(rawUsers)}
          className="w-4 h-4 cursor-pointer accent-blue-600"
        />
      ),
      accessor: 'Select',
    },
    ...(usersColumns || []),
  ]

  // Client-side Search Filtering
  const filteredRows = searchQuery
    ? allRows.filter((row) => {
        const query = searchQuery.toLowerCase()
        const fullName = String(row['Full Name'] || '').toLowerCase()
        const email = String(row['Email'] || '').toLowerCase()
        const binusEmail = String(row['Binus Email'] || '').toLowerCase()
        const nim = String(row['NIM'] || '').toLowerCase()

        return (
          fullName.includes(query) ||
          email.includes(query) ||
          binusEmail.includes(query) ||
          nim.includes(query)
        )
      })
    : allRows

  const pagedData = searchQuery
    ? filteredRows.slice(
        (pageIndex - 1) * itemsPerPage,
        pageIndex * itemsPerPage,
      )
    : filteredRows

  const totalItems =
    data?.pagination?.total ||
    data?.meta?.total ||
    data?.total ||
    filteredRows.length ||
    0

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

    if (
      editForm.whatsappNumber &&
      !/^\d{9,13}$/.test(editForm.whatsappNumber)
    ) {
      setAlert({
        type: 'error',
        message: 'WhatsApp number must be 9–13 digits.',
      })
      return
    }

    if (editForm.nim && !/^\d{10}$/.test(editForm.nim)) {
      setAlert({
        type: 'error',
        message: 'NIM must be exactly 10 digits.',
      })
      return
    }

    if (editForm.binusEmail && !/binus\.ac\.id$/i.test(editForm.binusEmail)) {
      setAlert({
        type: 'error',
        message: 'BINUS Email must end with binus.ac.id.',
      })
      return
    }

    editMutation.mutate(editForm)
  }

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value })
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()

    if (createForm.fullName.trim().length < 3) {
      setAlert({
        type: 'error',
        message: 'Full name must be at least 3 characters long.',
      })
      return
    }

    if (!/^\d{9,13}$/.test(createForm.whatsappNumber)) {
      setAlert({
        type: 'error',
        message: 'WhatsApp number must be 9–13 digits.',
      })
      return
    }

    if (!/^\d{10}$/.test(createForm.nim)) {
      setAlert({
        type: 'error',
        message: 'NIM must be exactly 10 digits.',
      })
      return
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(createForm.email)) {
      setAlert({
        type: 'error',
        message: 'Please enter a valid personal email.',
      })
      return
    }

    if (!/binus\.ac\.id$/i.test(createForm.binusEmail)) {
      setAlert({
        type: 'error',
        message: 'BINUS Email must end with binus.ac.id.',
      })
      return
    }

    if (
      createForm.password.length < 8 ||
      !/[A-Z]/.test(createForm.password) ||
      !/[a-z]/.test(createForm.password)
    ) {
      setAlert({
        type: 'error',
        message:
          'Password must be at least 8 characters long with 1 uppercase and 1 lowercase letter.',
      })
      return
    }

    createMutation.mutate(createForm)
  }

  const handleViewUser = async (userId) => {
    if (!userId) return
    setViewLoading(true)
    try {
      const detail = await getUserDetail(String(userId))
      setViewUser(detail?.data?.[0] ?? detail?.data ?? null)
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
      {showErrorModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-gray-600 mb-6">
              {(() => {
                const msg = error?.response?.data?.message
                const backendError = Array.isArray(msg) ? msg.join(', ') : msg
                return (
                  backendError ||
                  error?.response?.data?.error ||
                  error?.message ||
                  'An unknown error occurred.'
                )
              })()}
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

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[350px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            {viewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>
            ) : viewUser ? (
              <div className="space-y-2 mb-6">
                <div>
                  <b>Name:</b> {viewUser.name || '-'}
                </div>
                <div>
                  <b>Email:</b> {viewUser.email || '-'}
                </div>
                <div>
                  <b>Binus Email:</b>{' '}
                  {viewUser.binusEmail ||
                    viewUser.registrations?.[0]?.binusEmail ||
                    '-'}
                </div>
                <div>
                  <b>Status:</b> {viewUser.status || '-'}
                </div>
                <div>
                  <b>Role:</b> {viewUser.role ?? '-'}
                </div>
                <div>
                  <b>Created At:</b> {viewUser.createdAt || '-'}
                </div>
                <div>
                  <b>Updated At:</b> {viewUser.updatedAt || '-'}
                </div>
                {viewUser.registrations?.map((reg, idx) => (
                  <div key={idx} className="border-t pt-2 mt-2">
                    <div>
                      <b>NIM:</b> {reg?.nim || '-'}
                    </div>
                    <div>
                      <b>BNCC ID:</b> {reg?.bnccId || '-'}
                    </div>
                    <div>
                      <b>LINE:</b> {reg?.lineId || '-'}
                    </div>
                    <div>
                      <b>WhatsApp:</b> {reg?.whatsappNumber || '-'}
                    </div>
                    <div>
                      <b>Region:</b> {reg?.region?.name || '-'}
                    </div>
                    <div>
                      <b>Faculty:</b> {reg?.faculty?.name || '-'}
                    </div>
                    <div>
                      <b>Major:</b> {reg?.major?.name || '-'}
                    </div>
                    <div>
                      <b>LnT Course:</b> {reg?.lntCourse?.title || '-'}
                    </div>
                    <div>
                      <b>Schedule:</b> {reg?.schedule?.title || '-'}
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

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <form
            className="pointer-events-auto bg-white p-6 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[350px] max-w-[600px] w-full"
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
                minLength={3}
                required
              />
              <input
                name="email"
                type="email"
                value={editForm.email || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="Personal Email"
                required
              />
              <input
                name="binusEmail"
                value={editForm.binusEmail || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="Binus Email (@binus.ac.id)"
                required
              />
              <input
                name="nim"
                value={editForm.nim || ''}
                onChange={handleEditChange}
                className="border p-2 rounded w-full"
                placeholder="NIM (10 Digits)"
                maxLength={10}
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
                placeholder="WhatsApp (9–13 Digits)"
                maxLength={13}
                required
              />
              <select
                name="regionId"
                value={editForm.regionId}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    regionId: e.target.value,
                    facultyId: '',
                    majorId: '',
                    lntCourseId: '',
                    scheduleId: '',
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
                value={editForm.facultyId}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    facultyId: e.target.value,
                    majorId: '',
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
                value={editForm.majorId}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    majorId: e.target.value,
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
                value={editForm.lntCourseId}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    lntCourseId: e.target.value,
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
                value={editForm.scheduleId}
                onChange={(e) => {
                  setEditForm({
                    ...editForm,
                    scheduleId: e.target.value,
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <form
            className="pointer-events-auto bg-white p-6 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[350px] max-w-[600px] w-full"
            onSubmit={handleCreateSubmit}
          >
            <h3 className="text-xl font-bold mb-4">Create User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                name="fullName"
                value={createForm.fullName}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Full Name (Min 3 Chars)"
                minLength={3}
                required
              />
              <input
                name="email"
                type="email"
                value={createForm.email}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Personal Email"
                required
              />
              <input
                name="binusEmail"
                value={createForm.binusEmail}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Binus Email (@binus.ac.id)"
                required
              />
              <input
                name="password"
                type="password"
                value={createForm.password}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="Password (Min 8, 1 Upper, 1 Lower)"
                required
              />
              <input
                name="nim"
                value={createForm.nim}
                onChange={handleCreateChange}
                className="border p-2 rounded w-full"
                placeholder="NIM (10 Digits)"
                maxLength={10}
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
                placeholder="WhatsApp (9–13 Digits)"
                maxLength={13}
                required
              />
              <select
                name="status"
                value={createForm.status}
                onChange={handleCreateChange}
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
              <select
                name="regionId"
                value={createForm.regionId}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    regionId: e.target.value,
                    facultyId: '',
                    majorId: '',
                    lntCourseId: '',
                    scheduleId: '',
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
                value={createForm.facultyId}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    facultyId: e.target.value,
                    majorId: '',
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
                value={createForm.majorId}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    majorId: e.target.value,
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
                value={createForm.lntCourseId}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    lntCourseId: e.target.value,
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
                value={createForm.scheduleId}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    scheduleId: e.target.value,
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

      {/* ── BLAST WHATSAPP SETUP MODAL ── */}
      {showBlastModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-6 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[350px] max-w-[500px] w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Blast WhatsApp Message
            </h3>

            <div className="space-y-4 mb-6">
              {/* Scope Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Scope:
                </label>
                <select
                  value={blastScope}
                  onChange={(e) => setBlastScope(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-gray-50 focus:bg-white text-sm"
                  disabled={blastLoading}
                >
                  <option value="all_pages">
                    All Pages / Entire Database ({totalItems} total)
                  </option>
                  {selectedUserIds.size > 0 && (
                    <option value="selected">
                      Selected Users ({selectedUserIds.size} checked)
                    </option>
                  )}
                  <option value="current_page">
                    Current Page Only ({rawUsers.length} users)
                  </option>
                </select>
              </div>

              {/* Status Filter Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Filter By User Status:
                </label>
                <select
                  value={blastStatusFilter}
                  onChange={(e) => setBlastStatusFilter(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-gray-50 focus:bg-white text-sm"
                  disabled={blastLoading}
                >
                  <option value="all">All Statuses (No Filter)</option>
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

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-900">
                <b>Note:</b> Popups will open automatically with a 600ms delay
                per user to avoid WhatsApp rate limits. Please ensure popups are
                allowed in your browser settings.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBlastModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                disabled={blastLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBlast}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                disabled={blastLoading}
              >
                {blastLoading ? <Loader /> : 'Start Blast'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWhatsAppModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-left w-full max-w-lg">
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
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-left w-full max-w-lg">
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
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center">
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
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[60] pt-20">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center flex flex-col items-center">
            <Loader />
            <span className="mt-4 text-gray-700">Deleting user...</span>
          </div>
        </div>
      )}

      {alert && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[70] pt-20">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center flex flex-col items-center">
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

      {/* ── BULK ACTION FLOATING TOOLBAR ── */}
      {selectedUserIds.size > 0 && (
        <div className="mx-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 text-sm">
              {selectedUserIds.size} user{selectedUserIds.size > 1 ? 's' : ''}{' '}
              selected across all pages
            </span>
            <button
              onClick={() => setSelectedUserIds(new Set())}
              className="text-xs text-blue-600 underline ml-2 hover:text-blue-800"
              type="button"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="border p-2 rounded-lg text-sm bg-white"
            >
              <option value="">Select Bulk Status...</option>
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
              onClick={handleBulkStatusSubmit}
              disabled={bulkLoading || !bulkStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              type="button"
            >
              {bulkLoading ? <Loader /> : 'Apply Bulk Status'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-row flex-wrap items-center gap-4 min-w-fit px-6">
        <input
          type="text"
          placeholder="Search by Full Name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPageIndex(1)
          }}
          className="py-2 px-4 w-full md:w-[350px] border rounded"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
            type="button"
          >
            + Create User
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => setShowBlastModal(true)}
            type="button"
          >
            Blast WA Message{' '}
            {selectedUserIds.size > 0 ? `(${selectedUserIds.size})` : ''}
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
            columns={updatedColumns}
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
                  totalItem={totalItems}
                  itemsPerPage={itemsPerPage}
                  optionItemPerPage={[5, 10, 25, 50, 100]}
                  onChangeIndex={setPageIndex}
                  onChangeItemsPerPage={(val) => {
                    setItemsPerPage(val)
                    setPageIndex(1)
                  }}
                  disabled={isLoading}
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
