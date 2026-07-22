import { Table, Pagination } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { subscriptionColumns } from './constants';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllSubscribers, blastEmail } from '@/services/admin';

function Subscription() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const [showBlastModal, setShowBlastModal] = useState(false);
  const [delayTime, setDelayTime] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const abortRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['subscribers'],
    queryFn: getAllSubscribers,
  });

  const blastMutation = useMutation({
    mutationFn: (delayMs) => blastEmail(delayMs),
    onSuccess: () => {
      setAlert({
        type: 'success',
        message: 'Blast email sent successfully!',
      });
      setShowConfirmModal(false);
      setShowBlastModal(false);
      setDelayTime(0);
      refetch();
    },
    onError: (err) => {
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'Blast email failed.',
      });
      setShowConfirmModal(false);
      setShowBlastModal(false);
    },
  });

  useEffect(() => {
    if (isError) {
      setError(fetchError);
      setShowErrorModal(true);
    }
  }, [isError, fetchError]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const allData =
    data?.map((item) => ({
      ID: item.id ?? '-',
      'Created At': item.createdAt
        ? new Date(item.createdAt).toLocaleString('id-ID')
        : '-',
      Email: item.email ?? '-',
      Status: item.blastStatus ?? '-',
      'Blast Time': item.blastTime
        ? new Date(item.blastTime).toLocaleString('id-ID')
        : '-',
    })) ?? [];


  const filteredData = searchQuery
    ? allData.filter((row) =>
      (row.Email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allData;

  const pagedData = filteredData.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage
  );

  const handleRetry = () => {
    setShowErrorModal(false);
    setError(null);
    refetch();
  };

  const handleAlertClose = () => setAlert(null);

  const handleBlastClick = () => {
    setShowBlastModal(true);
    setDelayTime(0);
  };

  const handleBlastSubmit = (e) => {
    e.preventDefault();
    setShowBlastModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmBlast = () => {
    blastMutation.mutate(delayTime);
  };

  return (
    <div className={`py-6 space-y-7`}>
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {alert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[70]">
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

      {showBlastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <form
            className="bg-white p-8 rounded-lg shadow-xl text-center min-w-[350px]"
            onSubmit={handleBlastSubmit}
          >
            <h3 className="text-xl font-bold mb-4">Blast Email</h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Delay Time (ms)</label>
              <input
                type="number"
                min={0}
                value={delayTime}
                onChange={(e) => setDelayTime(Number(e.target.value))}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBlastModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center min-w-[350px]">
            <h3 className="text-xl font-bold mb-4">Confirm Blast</h3>
            <p className="mb-6">
              Are you sure you want to blast email with a delay of{' '}
              <b>{delayTime} ms</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlast}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={blastMutation.isPending}
              >
                {blastMutation.isPending ? 'Blasting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-7 min-w-fit px-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-2 px-4 w-[500px]"
        />
      </div>
      <div className="flex flex-row gap-7 min-w-fit px-6">
        <div className="p-5 rounded-[8px] bg-white">
          <Table
            columns={subscriptionColumns}
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
                    setItemsPerPage(val);
                    setPageIndex(1);
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleBlastClick}
                  type="button"
                >
                  BLAST
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Subscription;
