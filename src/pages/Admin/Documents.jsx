import { Table, Pagination } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { documentsColumns } from './constants';
import { useQuery } from '@tanstack/react-query';
import { getUsersDetails } from '@/services/admin';
import { base64ToBlob, isDataUrl } from '@/lib/utils';

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const abortRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['user-details'],
    queryFn: getUsersDetails,
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
    data?.data
      ?.map((user) => {
        const reg = user.registrations?.[0] || {};

        return {
          ID: `${user.id}` || '-',
          'BNCC ID': `${reg.bnccId}` || '-',
          'Full Name': user.name || '-',
          Region: reg.region?.name || '-',

          'Member Letter':
            reg.suratMember && reg.suratMember !== '-'
              ? (() => {
                  const v = reg.suratMember;

                  if (
                    isDataUrl(v) ||
                    /^([A-Za-z0-9+/=\-_\s]+)$/.test(v)
                  ) {
                    return (
                      <button
                        onClick={() => {
                          try {
                            let blob;

                            if (isDataUrl(v)) {
                              blob = base64ToBlob(v);
                            } else {
                              const normalized = v
                                .replace(/\s/g, '')
                                .replace(/-/g, '+')
                                .replace(/_/g, '/');

                              blob = base64ToBlob(
                                'data:application/octet-stream;base64,' +
                                  normalized
                              );
                            }

                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                            setTimeout(
                              () => URL.revokeObjectURL(url),
                              5000
                            );
                          } catch (e) {
                            console.error(
                              'Failed to open member letter',
                              e
                            );
                            window.alert('Failed to open file');
                          }
                        }}
                        className="text-blue-600 underline"
                      >
                        Member Letter
                      </button>
                    );
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
                  );
                })()
              : '-',

          'Binusian Card':
            reg.binusianCard && reg.binusianCard !== '-'
              ? (() => {
                  const v = reg.binusianCard;

                  if (
                    isDataUrl(v) ||
                    /^([A-Za-z0-9+/=\-_\s]+)$/.test(v)
                  ) {
                    return (
                      <button
                        onClick={() => {
                          try {
                            let blob;

                            if (isDataUrl(v)) {
                              blob = base64ToBlob(v);
                            } else {
                              const normalized = v
                                .replace(/\s/g, '')
                                .replace(/-/g, '+')
                                .replace(/_/g, '/');

                              blob = base64ToBlob(
                                'data:application/octet-stream;base64,' +
                                  normalized
                              );
                            }

                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                            setTimeout(
                              () => URL.revokeObjectURL(url),
                              5000
                            );
                          } catch (e) {
                            console.error(
                              'Failed to open binusian card',
                              e
                            );
                            window.alert('Failed to open file');
                          }
                        }}
                        className="text-blue-600 underline"
                      >
                        Binusian Card
                      </button>
                    );
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
                  );
                })()
              : '-',

          LinkedIn:
            reg.linkedinUrl && reg.linkedinUrl !== '-' ? (
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
            ),

          Github:
            reg.githubUrl && reg.githubUrl !== '-' ? (
              <a
                href={reg.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                GitHub
              </a>
            ) : (
              '-'
            ),
        };
      })
      .filter(
        (row) =>
          row['Member Letter'] !== '-' &&
          row['Binusian Card'] !== '-' &&
          row['LinkedIn'] !== '-' &&
          row['Github'] !== '-'
      ) ?? [];

  const filteredData = searchQuery
    ? allData.filter((row) =>
        (row['Full Name'] || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
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

  const handleAlertClose = () => {
    setAlert(null);
  };

  return (
    <div className="py-6 space-y-7">
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

            <span className="mb-4 text-gray-700">
              {alert.message}
            </span>

            <button
              onClick={handleAlertClose}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
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
            columns={documentsColumns}
            data={pagedData}
            loading={isLoading}
            striped
            bordered
            className="bg-white rounded-xl shadow-sm"
            tableFooter={
              <div
                className="w-full bg-white z-10 flex items-center justify-between px-4 py-4"
                style={{
                  boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
                }}
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
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
