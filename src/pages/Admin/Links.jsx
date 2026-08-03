import { Table, Pagination } from '@/components'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getLinks, createLink, updateLink, deleteLink } from '@/services/admin'

// Sesuaikan ID & Region dengan database kamu
const REGIONS = [
  { id: 1, code: 'KMG', name: 'Kemanggisan' },
  { id: 2, code: 'ALS', name: 'Alam Sutera' },
  { id: 3, code: 'BDG', name: 'Bandung' },
  { id: 4, code: 'MLG', name: 'Malang' },
]

const linkColumns = [
  { Header: 'ID', accessor: 'ID' },
  { Header: 'Nama Link', accessor: 'Nama Link' },
  { Header: 'Region', accessor: 'Region' },
  { Header: 'Tag', accessor: 'Tag' },
  { Header: 'URL', accessor: 'URL' },
  { Header: 'Actions', accessor: 'Actions' },
]

function Links() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State Modal Error & Alert Notification
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)

  // State Modal Tambah Link & Form Input
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({
    regionId: '',
    name: '',
    tag: 'ZOOM',
    url: '',
  })

  // State Modal Edit Link & Form Input
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: null,
    regionId: '',
    name: '',
    tag: 'ZOOM',
    url: '',
  })

  // State Modal Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const abortRef = useRef(null)

  // 1. GET Links
  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['admin-links'],
    queryFn: getLinks,
  })

  // 2. POST: Create Link
  const createMutation = useMutation({
    mutationFn: (payload) => createLink(payload),
    onSuccess: () => {
      setAlert({
        type: 'success',
        message: 'Link berhasil ditambahkan!',
      })
      setShowAddModal(false)
      setForm({ regionId: '', name: '', tag: 'ZOOM', url: '' })
      refetch()
    },
    onError: (err) => {
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'Gagal menambahkan link.',
      })
      setShowAddModal(false)
    },
  })

  // 3. PATCH: Update Link
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateLink(id, payload),
    onSuccess: () => {
      setAlert({
        type: 'success',
        message: 'Link berhasil diperbarui!',
      })
      setShowEditModal(false)
      refetch()
    },
    onError: (err) => {
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error || err?.message || 'Gagal mengedit link.',
      })
      setShowEditModal(false)
    },
  })

  // 4. DELETE: Delete Link
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLink(id),
    onSuccess: (res) => {
      setAlert({
        type: 'success',
        message: res?.message || 'Link berhasil dihapus!',
      })
      setShowDeleteModal(false)
      setDeleteTargetId(null)
      refetch()
    },
    onError: (err) => {
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error || err?.message || 'Gagal menghapus link.',
      })
      setShowDeleteModal(false)
      setDeleteTargetId(null)
    },
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

  const rawData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.links)
        ? data.links
        : []

  const handleOpenEditModal = (item) => {
    const matchedRegion = REGIONS.find(
      (r) => r.name === item.region?.name || r.id === item.regionId,
    )

    setEditForm({
      id: item.id,
      regionId: matchedRegion ? matchedRegion.id : item.regionId || '',
      name: item.name || '',
      tag: item.tag || 'ZOOM',
      url: item.url || '',
    })
    setShowEditModal(true)
  }

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId)
    }
  }

  const allData = rawData.map((item) => ({
    ID: item.id ?? '-',
    'Nama Link': item.name ?? '-',
    Region: item.region?.name || item.regionId || '-',
    Tag: (
      <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded font-medium">
        {item.tag ?? '-'}
      </span>
    ),
    URL: item.url ? (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline font-medium"
      >
        Buka Link ↗
      </a>
    ) : (
      '-'
    ),
    Actions: (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleOpenEditModal(item)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Link"
          type="button"
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
          onClick={() => handleOpenDeleteModal(item.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Link"
          type="button"
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
  }))

  const filteredData = searchQuery
    ? allData.filter(
        (row) =>
          (row['Nama Link'] || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          String(row.Region || '')
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

  const handleAlertClose = () => setAlert(null)

  const handleOpenAddModal = () => {
    setForm({ regionId: '', name: '', tag: 'ZOOM', url: '' })
    setShowAddModal(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      regionId: Number(form.regionId),
      name: form.name.trim(),
      tag: form.tag,
      url: form.url.trim(),
    })
  }

  const handleEditFormSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      id: editForm.id,
      payload: {
        regionId: Number(editForm.regionId),
        name: editForm.name.trim(),
        tag: editForm.tag,
        url: editForm.url.trim(),
      },
    })
  }

  return (
    <div className="py-6 space-y-7">
      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-50 pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-gray-600 mb-6">
              {error?.response?.data?.error ||
                error?.message ||
                'Terjadi kesalahan yang tidak diketahui.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      {alert && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[70] pt-20">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center flex flex-col items-center max-w-sm w-full mx-4">
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
            <span className="mb-2 text-lg font-semibold">
              {alert.type === 'success' ? 'Success' : 'Error'}
            </span>
            <span className="mb-6 text-gray-700">{alert.message}</span>
            <button
              onClick={handleAlertClose}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH LINK */}
      {showAddModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[100] pt-10 pb-10 overflow-y-auto">
          <form
            className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[380px] max-w-md w-full mx-4"
            onSubmit={handleFormSubmit}
          >
            <h3 className="text-xl font-bold mb-4 text-center">
              Tambah Link Baru
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Region
                </label>
                <select
                  value={form.regionId}
                  onChange={(e) =>
                    setForm({ ...form, regionId: e.target.value })
                  }
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Region --</option>
                  {REGIONS.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} ({reg.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama Link
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Zoom Class Mobile Dev"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tag
                </label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ZOOM">ZOOM</option>
                  <option value="GDRIVE">GDRIVE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  URL Link
                </label>
                <input
                  type="url"
                  placeholder="https://binus.zoom.us/j/..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EDIT LINK */}
      {showEditModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[100] pt-10 pb-10 overflow-y-auto">
          <form
            className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-left min-w-[380px] max-w-md w-full mx-4"
            onSubmit={handleEditFormSubmit}
          >
            <h3 className="text-xl font-bold mb-4 text-center">Edit Link</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Region
                </label>
                <select
                  value={editForm.regionId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, regionId: e.target.value })
                  }
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Region --</option>
                  {REGIONS.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} ({reg.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama Link
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Zoom Class Mobile Dev"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tag
                </label>
                <select
                  value={editForm.tag}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tag: e.target.value })
                  }
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ZOOM">ZOOM</option>
                  <option value="GDRIVE">GDRIVE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  URL Link
                </label>
                <input
                  type="url"
                  placeholder="https://binus.zoom.us/j/..."
                  value={editForm.url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, url: e.target.value })
                  }
                  className="border p-2.5 rounded-lg w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CONFIRM DELETE */}
      {showDeleteModal && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-[100] pt-10 pb-10 overflow-y-auto">
          <div className="pointer-events-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-center max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-3">Hapus Link</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Apakah Anda yakin ingin menghapus link ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-sm font-medium"
                disabled={deleteMutation.isPending}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH INPUT */}
      <div className="flex flex-row gap-7 min-w-fit px-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-2 px-4 w-[500px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE CONTAINER & PAGINATION */}
      <div className="flex flex-row gap-7 min-w-fit px-6">
        <div className="p-5 rounded-[8px] bg-white w-full">
          <Table
            columns={linkColumns}
            data={pagedData}
            loading={isLoading}
            striped={true}
            bordered={true}
            className="bg-white rounded-xl shadow-sm"
            tableFooter={
              <div
                className="w-full bg-white z-10 flex items-center justify-between px-4 py-4"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  onClick={handleOpenAddModal}
                  type="button"
                >
                  ADD LINK
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Links
