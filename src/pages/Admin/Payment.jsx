import { Table, Pagination } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { paymentColumns } from './constants';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getPaymentDetails,
  updatePaymentStatus,
  getPaymentProof,
} from '@/services/admin';
import { base64ToBlob, isDataUrl } from '@/lib/utils';

export default function Payment() {
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
    queryKey: ['payment-details'],
    queryFn: getPaymentDetails,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewIsPdf, setPreviewIsPdf] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }) =>
      updatePaymentStatus(userId, { status }),

    onSuccess: (data) => {
      setAlert({
        type: 'success',
        message: data?.message || 'Status updated',
      });

      refetch();
      setShowEditModal(false);
      setEditPayment(null);
      setEditValue(null);
    },

    onError: (err) => {
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'Failed to update status',
      });
    },
  });

  const proofMutation = useMutation({
    mutationFn: (userId) => getPaymentProof(userId),

    onSuccess: async (res) => {
      const responseData = res?.data ?? res;

      console.log('proof raw', responseData, {
        isString: typeof responseData === 'string',
        isArrayBuffer: responseData instanceof ArrayBuffer,
        isView: ArrayBuffer.isView(responseData),
      });

      const findCandidate = (val) => {
        if (val == null) return null;

        if (
          typeof val === 'string' ||
          val instanceof Blob ||
          val instanceof ArrayBuffer ||
          ArrayBuffer.isView(val) ||
          Array.isArray(val)
        ) {
          return val;
        }

        if (typeof val === 'object') {
          const keys = [
            'data',
            'file',
            'proof',
            'payload',
            'content',
            'base64',
          ];

          for (const k of keys) {
            if (k in val && val[k] != null) {
              return findCandidate(val[k]);
            }
          }

          for (const k of Object.keys(val)) {
            const found = findCandidate(val[k]);

            if (found != null) {
              return found;
            }
          }
        }

        return null;
      };


      const candidate = findCandidate(responseData);

      if (candidate == null) {
        setAlert({
          type: 'error',
          message: 'No proof available or invalid response format',
        });
        return;
      }

      const toBlob = async (c) => {
        if (c instanceof Blob) return c;

        if (c instanceof ArrayBuffer) return new Blob([c]);

        if (ArrayBuffer.isView(c)) {
          const ab = c.buffer.slice(
            c.byteOffset,
            c.byteOffset + c.byteLength
          );

          return new Blob([ab]);
        }

        if (Array.isArray(c) && c.every((n) => typeof n === 'number')) {
          return new Blob([new Uint8Array(c)]);
        }

        if (typeof c === 'string') {
          const s = c.trim();

          if (s.startsWith('data:')) {
            const resp = await fetch(s);
            return await resp.blob();
          }

          if (
            /^https?:\/\//i.test(s) ||
            s.startsWith('//') ||
            /\.(jpg|jpeg|png|webp|pdf)(\?|$)/i.test(s)
          ) {
            const resp = await fetch(s);
            return await resp.blob();
          }

          try {
            if (isDataUrl(s)) return base64ToBlob(s);

            let b64 = s
              .replace(/\s/g, '')
              .replace(/-/g, '+')
              .replace(/_/g, '/');

            while (b64.length % 4) {
              b64 += '=';
            }
            const maybe =
              'data:application/octet-stream;base64,' + b64;

            return base64ToBlob(maybe);
          } catch (err) {
            throw new Error('Invalid Base64 or unsupported proof string');
          }
        }

        throw new Error('Unsupported proof format');
      };

      try {
        const blob = await toBlob(candidate);

        if (!blob) {
          throw new Error('Failed to convert proof to blob');
        }

        const needsSniff =
          !blob.type || blob.type === 'application/octet-stream';

        let finalBlob = blob;

        if (needsSniff) {
          try {
            const ab = await blob.arrayBuffer();
            const view = new Uint8Array(ab);

            let detectedType = null;

            if (
              view.length > 3 &&
              view[0] === 0xff &&
              view[1] === 0xd8 &&
              view[2] === 0xff
            ) {
              detectedType = 'image/jpeg';
            } else if (
              view.length > 3 &&
              view[0] === 0x89 &&
              view[1] === 0x50 &&
              view[2] === 0x4e &&
              view[3] === 0x47
            ) {
              detectedType = 'image/png';
            } else if (
              view.length > 12 &&
              String.fromCharCode(
                view[0],
                view[1],
                view[2],
                view[3]
              ) === 'RIFF' &&
              String.fromCharCode(
                view[8],
                view[9],
                view[10],
                view[11]
              ) === 'WEBP'
            ) {
              detectedType = 'image/webp';
            } else if (
              view.length > 3 &&
              String.fromCharCode(
                view[0],
                view[1],
                view[2],
                view[3]
              ) === 'GIF8'
            ) {
              detectedType = 'image/gif';
            } else if (
              view.length > 3 &&
              String.fromCharCode(
                view[0],
                view[1],
                view[2],
                view[3]
              ) === '%PDF'
            ) {
              detectedType = 'application/pdf';
            }

            if (detectedType) {
              finalBlob = new Blob([ab], {
                type: detectedType,
              });
            }
          } catch (sniffErr) {
            console.warn('MIME sniff failed', sniffErr);
          }
        }

        if (
          finalBlob.type === 'application/pdf' ||
          (typeof candidate === 'string' &&
            candidate.match(/\.pdf(\?|$)/i))
        ) {
          setAlert({
            type: 'error',
            message:
              'Payment proof must be an image (JPG/PNG). PDF proofs are not supported.',
          });
          return;
        }

        const url = URL.createObjectURL(finalBlob);

        setPreviewUrl(url);
        setPreviewIsPdf(finalBlob.type === 'application/pdf');
        setPreviewOpen(true);

      } catch (err) {
        console.error('Proof decode error:', err);

        setAlert({
          type: 'error',
          message: err?.message || 'Failed to decode proof',
        });
      }
    },

    onError: (err) =>
      setAlert({
        type: 'error',
        message:
          err?.response?.data?.error || 'Failed to fetch proof',
      }),
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
    data?.data?.map((details) => {
      return {
        ID: `${details.userId}` || '-',
        'BNCC ID': `${details.bnccId}` || '-',
        'Full Name': details.name || '-',
        Region: details.region || '-',
        'JaPres Type': details.is_japres || '-',
        'Payment Status': details.payment_status || '-',
        'Order ID': details.order_id || '-',
        Amount: details.amount || '-',
        'Payment Proof': (
          <button
            onClick={() => proofMutation.mutate(details.userId)}
            aria-label="Preview Proof"
            className="mx-1 underline text-blue-600"
          >
            Preview
          </button>
        ),
        Actions: (
          <button
            onClick={() => {
              setEditPayment(details);
              setEditValue(
                details.payment_status === 'PAID' ? 'PAID' : 'UNPAID'
              );
              setShowEditModal(true);
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
        ),
      };
    }) ?? [];

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

  const handleAlertClose = () => setAlert(null);

  return (
    <div className={`py-6 space-y-7`}>
      {showEditModal && editPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Edit Payment Status</h3>
            <p className="mb-4">
              User: {editPayment.name} ({editPayment.bnccId})
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Select status</label>
              <select
                value={editValue ?? ''}
                onChange={(e) => setEditValue(e.target.value || null)}
                className="w-full border p-2 rounded"
              >
                <option value="PAID">PAID</option>
                <option value="UNPAID">UNPAID</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-2 rounded bg-gray-200"
                onClick={() => {
                  setShowEditModal(false);
                  setEditPayment(null);
                  setEditValue(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                onClick={() => {
                  if (!editValue) return;
                  updateStatusMutation.mutate({
                    userId: editPayment.userId,
                    status: editValue,
                  });
                }}
                disabled={!editValue}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
      {previewOpen && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-[90%] max-h-[90%] overflow-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Payment Proof Preview</h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Open in new tab
                </a>
                <button
                  className="px-3 py-1 rounded bg-gray-200"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setPreviewOpen(false);
                    setPreviewIsPdf(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {previewIsPdf ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh]"
                  title="proof-pdf"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="proof"
                  className="max-h-[70vh] object-contain"
                />
              )}
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
            columns={paymentColumns}
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
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
