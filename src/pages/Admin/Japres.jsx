// import { Table, Pagination } from '@/components';
import { useState, useEffect, useRef } from 'react';
// import { japresColumns } from './constants';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import {
//   downloadJapresExcel,
//   getJapres,
//   updateJapresStatus,
// } from '@/services/admin';

export default function Japres() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editJapres, setEditJapres] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const abortRef = useRef(null);

  // const {
  //   data,
  //   isLoading,
  //   isError,
  //   error: fetchError,
  //   refetch,
  // } = useQuery({
  //   queryKey: ['japres'],
  //   queryFn: getJapres,
  // });

  // useEffect(() => {
  //   if (isError) {
  //     setError(fetchError);
  //     setShowErrorModal(true);
  //   }
  // }, [isError, fetchError]);

  // useEffect(() => {
  //   return () => {
  //     abortRef.current?.abort();
  //   };
  // }, []);

  // const editMutation = useMutation({
  //   mutationFn: async ({
  //     userId,
  //     isJapres,
  //   }: {
  //     userId: number;
  //     isJapres: number;
  //   }) => {
  //     return updateJapresStatus(String(userId), isJapres);
  //   },
  //   onSuccess: () => {
  //     setAlert({
  //       type: 'success',
  //       message: 'Japres status updated successfully!',
  //     });
  //     setShowEditModal(false);
  //     setShowConfirmModal(false);
  //     setEditJapres(null);
  //     setEditValue(null);
  //     refetch();
  //   },
  //   onError: (err: any) => {
  //     setAlert({
  //       type: 'error',
  //       message:
  //         err?.response?.data?.error ||
  //         err?.message ||
  //         'Failed to update Japres status.',
  //     });
  //     setShowEditModal(false);
  //     setShowConfirmModal(false);
  //   },
  // });

  // const allData =
  //   data?.data?.map((item) => ({
  //     ID: `${item.userId}` || '-',
  //     Email: item.email || '-',
  //     'Full Name': item.name || '-',
  //     Region: item.region || '-',
  //     'Link Drive': item.japres_url ? (
  //       <a
  //         href={item.japres_url}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-blue-600 underline"
  //       >
  //         Drive Link
  //       </a>
  //     ) : (
  //       '-'
  //     ),
  //     'JaPres Type': item.status,
  //     'Submit Date': item.submittedAt
  //       ? new Date(item.submittedAt).toLocaleString('id-ID')
  //       : '-',
  //     Actions: (
  //       <button
  //         onClick={() => {
  //           setEditJapres(item);
  //           setEditValue(null);
  //           setShowEditModal(true);
  //         }}
  //         aria-label="Edit"
  //         className="mx-1"
  //       >
  //         <svg
  //           width={18}
  //           height={18}
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //         >
  //           <path
  //             d="M16.862 3.487a2.07 2.07 0 0 1 2.93 2.93l-1.1 1.1-2.93-2.93 1.1-1.1zm-2.1 2.1 2.93 2.93-9.1 9.1H5.662v-3.03l9.1-9.1z"
  //             stroke="currentColor"
  //             strokeWidth={2}
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //           />
  //         </svg>
  //       </button>
  //     ),
  //   })) ?? [];

  // const filteredData = searchQuery
  //   ? allData.filter((row) =>
  //       (row['Full Name'] || '')
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase())
  //     )
  //   : allData;

  // const pagedData = filteredData.slice(
  //   (pageIndex - 1) * itemsPerPage,
  //   pageIndex * itemsPerPage
  // );

  // const handleRetry = () => {
  //   setShowErrorModal(false);
  //   setError(null);
  //   refetch();
  // };

  // const handleAlertClose = () => setAlert(null);

  // const getEditOptions = () => {
  //   if (!editJapres) return [];
  //   if (editJapres.is_japres === null) {
  //     return [
  //       { value: -1, label: 'Pending' },
  //       { value: 0, label: 'Rejected' },
  //       { value: 1, label: 'Accepted Silver' },
  //       { value: 2, label: 'Accepted Gold' },
  //     ];
  //   }
  //   if (editJapres.is_japres === -1) {
  //     return [
  //       { value: 0, label: 'Rejected' },
  //       { value: 1, label: 'Accepted Silver' },
  //       { value: 2, label: 'Accepted Gold' },
  //     ];
  //   }
  //   return [
  //     { value: -1, label: 'Pending' },
  //     { value: 0, label: 'Rejected' },
  //     { value: 1, label: 'Accepted Silver' },
  //     { value: 2, label: 'Accepted Gold' },
  //   ];
  // };

  // const handleEditSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setShowEditModal(false);
  //   setShowConfirmModal(true);
  // };

  // const handleConfirmEdit = () => {
  //   if (editJapres && editValue !== null) {
  //     editMutation.mutate({ userId: editJapres.userId, isJapres: editValue });
  //   }
  // };

  return (
    // <div className={`py-6 space-y-7`}>
    //   {showErrorModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-center">
    //         <h3 className="text-xl font-bold mb-4">Error</h3>
    //         <p className="text-gray-600 mb-6">
    //           {error?.response?.data?.error ||
    //             error?.message ||
    //             'An unknown error occurred.'}
    //         </p>
    //         <div className="flex justify-center space-x-4">
    //           <button
    //             onClick={() => setShowErrorModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Close
    //           </button>
    //           <button
    //             onClick={handleRetry}
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //           >
    //             Retry
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {alert && (
    //     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[70]">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center">
    //         {alert.type === 'success' ? (
    //           <svg
    //             className="w-10 h-10 text-green-500 mb-2"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M5 13l4 4L19 7"
    //             />
    //           </svg>
    //         ) : (
    //           <svg
    //             className="w-10 h-10 text-red-500 mb-2"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M6 18L18 6M6 6l12 12"
    //             />
    //           </svg>
    //         )}
    //         <span className="mb-4 text-lg font-semibold">
    //           {alert.type === 'success' ? 'Success' : 'Error'}
    //         </span>
    //         <span className="mb-4 text-gray-700">{alert.message}</span>
    //         <button
    //           onClick={handleAlertClose}
    //           className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //         >
    //           Close
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   <div className="flex flex-row gap-7 min-w-fit px-6">
    //     <input
    //       type="text"
    //       placeholder="Search..."
    //       value={searchQuery}
    //       onChange={(e) => setSearchQuery(e.target.value)}
    //       className="py-2 px-4 w-[500px]"
    //     />
    //   </div>
    //   <div className="flex flex-row gap-7 min-w-fit px-6">
    //     <div className="p-5 rounded-[8px] bg-white">
    //       <Table
    //         columns={japresColumns}
    //         data={pagedData}
    //         loading={isLoading}
    //         striped={true}
    //         bordered={true}
    //         className="bg-white rounded-xl shadow-sm"
    //         tableFooter={
    //           <div
    //             className="w-full bg-white z-10 flex items-center justify-between px-4 py-4"
    //             style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.04)' }}
    //           >
    //             <Pagination
    //               index={pageIndex}
    //               totalItem={filteredData.length}
    //               itemsPerPage={itemsPerPage}
    //               optionItemPerPage={[5, 10, 25, 50, 100]}
    //               onChangeIndex={setPageIndex}
    //               onChangeItemsPerPage={(val) => {
    //                 setItemsPerPage(val);
    //                 setPageIndex(1);
    //               }}
    //             />
    //             <button
    //               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    //               onClick={downloadJapresExcel}
    //               type="button"
    //             >
    //               DOWNLOAD
    //             </button>
    //           </div>
    //         }
    //       />
    //     </div>
    //   </div>

    //   {showEditModal && editJapres && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
    //       <form
    //         className="bg-white p-8 rounded-lg shadow-xl text-left min-w-[350px] max-w-[90vw]"
    //         onSubmit={handleEditSubmit}
    //         style={{ width: '100%', maxWidth: 600 }}
    //       >
    //         <h3 className="text-xl font-bold mb-4">Edit Japres Status</h3>
    //         <div className="mb-4">
    //           <b>Name:</b> {editJapres.name}
    //           <br />
    //           <b>Email:</b> {editJapres.email}
    //           <br />
    //           <b>Region:</b> {editJapres.region}
    //           <br />
    //           <b>Japres Type:</b> {editJapres.status}
    //           <br />
    //           <b>Submitted At:</b>{' '}
    //           {editJapres.submittedAt
    //             ? new Date(editJapres.submittedAt).toLocaleString('id-ID')
    //             : '-'}
    //           <br />
    //           <b>Drive Link:</b>{' '}
    //           {editJapres.japres_url ? (
    //             <a
    //               href={editJapres.japres_url}
    //               target="_blank"
    //               rel="noopener noreferrer"
    //               className="text-blue-600 underline"
    //             >
    //               Drive Link
    //             </a>
    //           ) : (
    //             '-'
    //           )}
    //         </div>
    //         <div className="mb-4">
    //           <label className="block mb-2 font-medium">Japres Status</label>
    //           <select
    //             value={editValue !== null ? editValue : ''}
    //             onChange={(e) => {
    //               const val = e.target.value;
    //               setEditValue(val === '' ? null : Number(val));
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //           >
    //             <option value="" disabled>
    //               Choose status
    //             </option>
    //             {getEditOptions().map((opt) => (
    //               <option key={opt.value} value={opt.value}>
    //                 {opt.label}
    //               </option>
    //             ))}
    //           </select>
    //           {editValue === null && (
    //             <span className="text-red-500 text-xs mt-1 block">
    //               Please select a status.
    //             </span>
    //           )}
    //         </div>
    //         <div className="flex justify-end gap-2">
    //           <button
    //             type="button"
    //             onClick={() => setShowEditModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="submit"
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //             disabled={editValue === null}
    //           >
    //             Next
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   )}

    //   {showConfirmModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-center min-w-[350px]">
    //         <h3 className="text-xl font-bold mb-4">Confirm Edit</h3>
    //         <p className="mb-6">
    //           Are you sure you want to change Japres status to{' '}
    //           <b>
    //             {getEditOptions().find((opt) => opt.value === editValue)?.label}
    //           </b>
    //           ?
    //         </p>
    //         <div className="flex justify-end gap-2">
    //           <button
    //             type="button"
    //             onClick={() => setShowConfirmModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="button"
    //             onClick={handleConfirmEdit}
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //             disabled={editMutation.isPending}
    //           >
    //             {editMutation.isPending ? 'Saving...' : 'Confirm'}
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <h1>Japres</h1>
  );
}
