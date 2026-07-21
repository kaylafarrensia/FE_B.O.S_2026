import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import Loader from '@/components/ui/loader';
import { useState, useEffect, useRef } from 'react';
import { usersColumns } from './constants';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getUsersDetails,
  deleteUser,
  updateUser,
  createUser,
  downloadUsersExcel,
  getUserDetail,
} from '@/services/admin';
import { base64ToBlob, isDataUrl } from '@/lib/utils';
import useLookupQuery from '@/hooks/queries/useLookupQuery';

function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  });
  const [editLoading, setEditLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);

  const [whatsAppMessage, setWhatsAppMessage] = useState(
    `Halo, {nama}!

Jangan lewatkan codesign BNCC 2025 untuk mendapatkan materi yang dapat mempersiapkan kamu sebagai seorang developers!

https://www.instagram.com/bnccbinus/

Best Regards,
Panitia BNCC Launching`
  );
  const [tempWhatsAppMessage, setTempWhatsAppMessage] =
    useState(whatsAppMessage);

  // const {
  //   regionQuery,
  //   facultyQuery,
  //   majorQuery,
  //   lntCourseQuery,
  //   scheduleQuery,
  // } = useLookupQuery();

//   const abortRef = useRef(null);

//   const watchedRegionId = editForm.regionId;
//   const watchedFacultyId = editForm.facultyId;

//   const regions = regionQuery.data || [];
//   const faculties =
//     facultyQuery.data?.filter(
//       (faculty) => faculty.regionId === watchedRegionId
//     ) || [];
//   const majors =
//     majorQuery.data?.filter(
//       (major) => major.facultyId === watchedFacultyId
//     ) || [];
//   const lntCourses =
//     lntCourseQuery.data?.filter(
//       (course) => course.regionId === watchedRegionId
//     ) || [];
//   const schedules =
//     scheduleQuery.data?.filter(
//       (schedule) => schedule.regionId === watchedRegionId
//     ) || [];

//   const watchedCreateRegionId = createForm.regionId;
//   const watchedCreateFacultyId = createForm.facultyId;

//   const createFaculties =
//     facultyQuery.data?.filter(
//       (faculty) => faculty.regionId === watchedCreateRegionId
//     ) || [];
//   const createMajors =
//     majorQuery.data?.filter(
//       (major) => major.facultyId === watchedCreateFacultyId
//     ) || [];
//   const createLntCourses =
//     lntCourseQuery.data?.filter(
//       (course) => course.regionId === watchedCreateRegionId
//     ) || [];
//   const createSchedules =
//     scheduleQuery.data?.filter(
//       (schedule) => schedule.regionId === watchedCreateRegionId
//     ) || [];

//   const {
//     data,
//     isLoading,
//     isError,
//     error: fetchError,
//     refetch,
//   } = useQuery({
//     queryKey: ['user-details'],
//     queryFn: getUsersDetails,
//   });

//   useEffect(() => {
//     if (isError) {
//       setError(fetchError);
//       setShowErrorModal(true);
//     }
//   }, [isError, fetchError]);

//   useEffect(() => {
//     return () => {
//       abortRef.current?.abort();
//     };
//   }, []);

//   const mutation = useMutation({
//     mutationFn: (id) => {
//       abortRef.current = new AbortController();
//       return deleteUser(id, { signal: abortRef.current.signal });
//     },
//     onSuccess: () => {
//       setDeleting(false);
//       setShowDeleteModal(false);
//       setAlert({ type: 'success', message: 'User deleted successfully.' });
//       refetch();
//     },
//     onError: (err) => {
//       setDeleting(false);
//       setShowDeleteModal(false);
//       setAlert({
//         type: 'error',
//         message:
//           err?.response?.data?.error ||
//           err?.message ||
//           'An unknown error occurred.',
//       });
//     },
//   });

//   const editMutation = useMutation({
//     mutationFn: (form) => updateUser(form),
//     onMutate: () => setEditLoading(true),
//     onSuccess: () => {
//       setEditLoading(false);
//       setShowEditModal(false);
//       setAlert({ type: 'success', message: 'User updated successfully.' });
//       refetch();
//     },
//     onError: (err) => {
//       setEditLoading(false);
//       setAlert({
//         type: 'error',
//         message:
//           err?.response?.data?.error ||
//           err?.message ||
//           'An unknown error occurred.',
//       });
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: (form) => createUser(form),
//     onMutate: () => setCreateLoading(true),
//     onSuccess: () => {
//       setCreateLoading(false);
//       setShowCreateModal(false);
//       setAlert({ type: 'success', message: 'User created successfully.' });
//       refetch();
//       setCreateForm({
//         fullName: '',
//         email: '',
//         password: '',
//         nim: '',
//         regionId: 0,
//         lineId: '',
//         whatsappNumber: '',
//         facultyId: 0,
//         majorId: 0,
//         lntCourseId: 0,
//         scheduleId: 0,
//         isJapres: null,
//       });
//     },
//     onError: (err) => {
//       setCreateLoading(false);
//       setAlert({
//         type: 'error',
//         message:
//           err?.response?.data?.error ||
//           err?.message ||
//           'An unknown error occurred.',
//       });
//     },
//   });

//   const OpenWhatsApp = (number, text) => {
//     const formatText = encodeURIComponent(text);
//     window.open(`https://wa.me/+62${number}?text=${formatText}`);
//   };

//   const allData =
//     data?.data?.map((user) => {
//       const reg = user.registrations?.[0] || {};
//       return {
//         ID: user.id,
//         'BNCC ID': reg.bnccId || '-',
//         'Full Name': user.name || '-',
//         Status: user.status || '-',
//         Email: user.email || '-',
//         LINE: reg.lineId || '-',
//         WhatsApp: reg.whatsappNumber ? (
//           <a
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               const message = whatsAppMessage.replace('{nama}', user.name);
//               OpenWhatsApp(reg.whatsappNumber, message);
//             }}
//             className="text-blue-600 underline"
//           >
//             {reg.whatsappNumber}
//           </a>
//         ) : (
//           '-'
//         ),
//         NIM: reg.nim || '-',
//         'LnT Course': reg.lntCourse?.title || '-',
//         'Launching Schedule': reg.schedule?.title || '-',
//         Major: reg.major?.name || '-',
//         Faculty: reg.faculty?.name || '-',
//         Region: reg.region?.name || '-',
//         Actions: (
//           <div className="flex flex-row justify-between">
//             <button
//               onClick={() => handleViewUser(user.id)}
//               aria-label="View"
//               className="mx-1"
//             >
//               <svg
//                 width={18}
//                 height={18}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <circle
//                   cx="12"
//                   cy="12"
//                   r="3"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setEditForm({
//                   id: user.id,
//                   name: user.name,
//                   email: user.email,
//                   nim: reg.nim,
//                   lineId: reg.lineId,
//                   whatsappNumber: reg.whatsappNumber,
//                   regionId: reg.region?.id ?? 0,
//                   facultyId: reg.faculty?.id ?? 0,
//                   majorId: reg.major?.id ?? 0,
//                   lntCourseId: reg.lntCourse?.id ?? 0,
//                   scheduleId: reg.schedule?.id ?? 0,
//                   status: user.status ?? '',
//                 });
//                 setShowEditModal(true);
//               }}
//               aria-label="Edit"
//               className="mx-1"
//             >
//               <svg
//                 width={18}
//                 height={18}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M16.862 3.487a2.07 2.07 0 0 1 2.93 2.93l-1.1 1.1-2.93-2.93 1.1-1.1zm-2.1 2.1 2.93 2.93-9.1 9.1H5.662v-3.03l9.1-9.1z"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setDeleteTarget(user.id);
//                 setShowDeleteModal(true);
//               }}
//               aria-label="Delete"
//               className="mx-1"
//             >
//               <svg
//                 width={18}
//                 height={18}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 10v-6m4 6v-6"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           </div>
//         ),
//       };
//     }) ?? [];

//   const filteredData = searchQuery
//     ? allData.filter((row) =>
//       (row['Full Name'] || '')
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     )
//     : allData;

//   const pagedData = filteredData.slice(
//     (pageIndex - 1) * itemsPerPage,
//     pageIndex * itemsPerPage
//   );

//   const handleRetry = () => {
//     setShowErrorModal(false);
//     setError(null);
//     refetch();
//   };

//   const handleDeleteConfirm = () => {
//     if (deleteTarget) {
//       setDeleting(true);
//       mutation.mutate(deleteTarget);
//     }
//   };

//   const handleAlertClose = () => setAlert(null);

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     editMutation.mutate(editForm);
//   };

//   const handleCreateChange = (e) => {
//     setCreateForm({ ...createForm, [e.target.name]: e.target.value });
//   };

//   const handleCreateSubmit = (e) => {
//     e.preventDefault();
//     createMutation.mutate(createForm);
//   };

//   const handleViewUser = async (userId) => {
//     setViewLoading(true);
//     try {
//       const detail = await getUserDetail(String(userId));
//       setViewUser(detail.data?.[0] ?? detail.data ?? null);
//       setShowViewModal(true);
//     } catch (err) {
//       setAlert({
//         type: 'error',
//         message: 'Failed to fetch user details.',
//       });
//       setShowViewModal(true);
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   const handleSaveWhatsAppMessage = () => {
//     setWhatsAppMessage(tempWhatsAppMessage);
//     setShowWhatsAppModal(false);
//   };

  return (
    // <div className={`py-6 space-y-7 ${deleting ? 'pointer-events-none' : ''}`}>
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

    //   {showViewModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-left min-w-[350px] max-w-[90vw]">
    //         <h3 className="text-xl font-bold mb-4">User Details</h3>
    //         {viewLoading ? (
    //           <div className="flex items-center justify-center py-8">
    //             <Loader />
    //           </div>
    //         ) : viewUser ? (
    //           <div className="space-y-2 mb-6">
    //             <div>
    //               <b>Name:</b> {viewUser.name}
    //             </div>
    //             <div>
    //               <b>Email:</b> {viewUser.email}
    //             </div>
    //             <div>
    //               <b>Status:</b> {viewUser.status}
    //             </div>
    //             <div>
    //               <b>Role:</b> {viewUser.role}
    //             </div>
    //             <div>
    //               <b>Created At:</b> {viewUser.createdAt}
    //             </div>
    //             <div>
    //               <b>Updated At:</b> {viewUser.updatedAt}
    //             </div>
    //             {viewUser.registrations?.map((reg, idx) => (
    //               <div key={idx} className="border-t pt-2 mt-2">
    //                 <div>
    //                   <b>NIM:</b> {reg.nim}
    //                 </div>
    //                 <div>
    //                   <b>BNCC ID:</b> {reg.bnccId}
    //                 </div>
    //                 <div>
    //                   <b>LINE:</b> {reg.lineId}
    //                 </div>
    //                 <div>
    //                   <b>WhatsApp:</b> {reg.whatsappNumber}
    //                 </div>
    //                 <div>
    //                   <b>Region:</b> {reg.region?.name}
    //                 </div>
    //                 <div>
    //                   <b>Faculty:</b> {reg.faculty?.name}
    //                 </div>
    //                 <div>
    //                   <b>Major:</b> {reg.major?.name}
    //                 </div>
    //                 <div>
    //                   <b>LnT Course:</b> {reg.lntCourse?.title}
    //                 </div>
    //                 <div>
    //                   <b>Schedule:</b> {reg.schedule?.title}
    //                 </div>
    //                 <div>
    //                   <b>LinkedIn:</b>{' '}
    //                   {reg.linkedinUrl ? (
    //                     <a
    //                       href={reg.linkedinUrl}
    //                       target="_blank"
    //                       rel="noopener noreferrer"
    //                       className="text-blue-600 underline"
    //                     >
    //                       LinkedIn
    //                     </a>
    //                   ) : (
    //                     '-'
    //                   )}
    //                 </div>
    //                 <div>
    //                   <b>Github:</b>{' '}
    //                   {reg.githubUrl ? (
    //                     <a
    //                       href={reg.githubUrl}
    //                       target="_blank"
    //                       rel="noopener noreferrer"
    //                       className="text-blue-600 underline"
    //                     >
    //                       Github
    //                     </a>
    //                   ) : (
    //                     '-'
    //                   )}
    //                 </div>
    //                 <div>
    //                   <b>Member Letter:</b>{' '}
    //                   {reg.suratMember
    //                     ? (() => {
    //                       const v = reg.suratMember;
    //                       if (
    //                         isDataUrl(v) ||
    //                         /^([A-Za-z0-9+\/=\-_\s]+)$/.test(v)
    //                       ) {
    //                         return (
    //                           <button
    //                             onClick={async () => {
    //                               try {
    //                                 let blob;
    //                                 if (isDataUrl(v)) blob = base64ToBlob(v);
    //                                 else {
    //                                   const normalized = v
    //                                     .replace(/\s/g, '')
    //                                     .replace(/-/g, '+')
    //                                     .replace(/_/g, '/');
    //                                   blob = base64ToBlob(
    //                                     'data:application/octet-stream;base64,' +
    //                                     normalized
    //                                   );
    //                                 }
    //                                 const url = URL.createObjectURL(blob);
    //                                 window.open(url, '_blank');
    //                                 setTimeout(
    //                                   () => URL.revokeObjectURL(url),
    //                                   5000
    //                                 );
    //                               } catch (e) {
    //                                 console.error(
    //                                   'Failed to open member letter',
    //                                   e
    //                                 );
    //                                 window.alert('Failed to open file');
    //                               }
    //                             }}
    //                             className="text-blue-600 underline"
    //                           >
    //                             Member Letter
    //                           </button>
    //                         );
    //                       }
    //                       return (
    //                         <a
    //                           href={v}
    //                           target="_blank"
    //                           rel="noopener noreferrer"
    //                           className="text-blue-600 underline"
    //                         >
    //                           Member Letter
    //                         </a>
    //                       );
    //                     })()
    //                     : '-'}
    //                 </div>
    //                 <div>
    //                   <b>Binusian Card:</b>{' '}
    //                   {reg.binusianCard
    //                     ? (() => {
    //                       const v = reg.binusianCard;
    //                       if (
    //                         isDataUrl(v) ||
    //                         /^([A-Za-z0-9+\/=\-_\s]+)$/.test(v)
    //                       ) {
    //                         return (
    //                           <button
    //                             onClick={async () => {
    //                               try {
    //                                 let blob;
    //                                 if (isDataUrl(v)) blob = base64ToBlob(v);
    //                                 else {
    //                                   const normalized = v
    //                                     .replace(/\s/g, '')
    //                                     .replace(/-/g, '+')
    //                                     .replace(/_/g, '/');
    //                                   blob = base64ToBlob(
    //                                     'data:application/octet-stream;base64,' +
    //                                     normalized
    //                                   );
    //                                 }
    //                                 const url = URL.createObjectURL(blob);
    //                                 window.open(url, '_blank');
    //                                 setTimeout(
    //                                   () => URL.revokeObjectURL(url),
    //                                   5000
    //                                 );
    //                               } catch (e) {
    //                                 console.error(
    //                                   'Failed to open binusian card',
    //                                   e
    //                                 );
    //                                 window.alert('Failed to open file');
    //                               }
    //                             }}
    //                             className="text-blue-600 underline"
    //                           >
    //                             Binusian Card
    //                           </button>
    //                         );
    //                       }
    //                       return (
    //                         <a
    //                           href={v}
    //                           target="_blank"
    //                           rel="noopener noreferrer"
    //                           className="text-blue-600 underline"
    //                         >
    //                           Binusian Card
    //                         </a>
    //                       );
    //                     })()
    //                     : '-'}
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         ) : (
    //           <p>Could not load user details.</p>
    //         )}
    //         <div className="flex justify-end">
    //           <button
    //             onClick={() => {
    //               setShowViewModal(false);
    //               setViewUser(null);
    //             }}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {showEditModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <form
    //         className="bg-white p-6 rounded-lg shadow-xl text-left min-w-[350px] max-w-[600px] w-full"
    //         onSubmit={handleEditSubmit}
    //       >
    //         <h3 className="text-xl font-bold mb-4">Edit User</h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    //           <input
    //             name="name"
    //             value={editForm.name || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="Name"
    //             required
    //           />
    //           <input
    //             name="email"
    //             value={editForm.email || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="Email"
    //             required
    //           />
    //           <input
    //             name="nim"
    //             value={editForm.nim || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="NIM"
    //             required
    //           />
    //           <input
    //             name="lineId"
    //             value={editForm.lineId || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="LINE ID"
    //             required
    //           />
    //           <input
    //             name="whatsappNumber"
    //             value={editForm.whatsappNumber || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="WhatsApp"
    //             required
    //           />
    //           <select
    //             name="regionId"
    //             value={editForm.regionId || ''}
    //             onChange={(e) => {
    //               setEditForm({
    //                 ...editForm,
    //                 regionId: Number(e.target.value),
    //                 facultyId: 0,
    //                 majorId: 0,
    //                 lntCourseId: 0,
    //                 scheduleId: 0,
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //           >
    //             <option value="">Select Region</option>
    //             {regions.map((r) => (
    //               <option key={r.id} value={r.id}>
    //                 {r.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="facultyId"
    //             value={editForm.facultyId || ''}
    //             onChange={(e) => {
    //               setEditForm({
    //                 ...editForm,
    //                 facultyId: Number(e.target.value),
    //                 majorId: 0,
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!editForm.regionId}
    //           >
    //             <option value="">Select Faculty</option>
    //             {faculties.map((f) => (
    //               <option key={f.id} value={f.id}>
    //                 {f.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="majorId"
    //             value={editForm.majorId || ''}
    //             onChange={(e) => {
    //               setEditForm({
    //                 ...editForm,
    //                 majorId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!editForm.facultyId}
    //           >
    //             <option value="">Select Major</option>
    //             {majors.map((m) => (
    //               <option key={m.id} value={m.id}>
    //                 {m.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="lntCourseId"
    //             value={editForm.lntCourseId || ''}
    //             onChange={(e) => {
    //               setEditForm({
    //                 ...editForm,
    //                 lntCourseId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!editForm.regionId}
    //           >
    //             <option value="">Select LnT Course</option>
    //             {lntCourses.map((l) => (
    //               <option key={l.id} value={l.id}>
    //                 {l.title}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="scheduleId"
    //             value={editForm.scheduleId || ''}
    //             onChange={(e) => {
    //               setEditForm({
    //                 ...editForm,
    //                 scheduleId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!editForm.regionId}
    //           >
    //             <option value="">Select Schedule</option>
    //             {schedules.map((s) => (
    //               <option key={s.id} value={s.id}>
    //                 {s.title}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="status"
    //             value={editForm.status || ''}
    //             onChange={handleEditChange}
    //             className="border p-2 rounded w-full"
    //             required
    //           >
    //             <option value="">Select Status</option>
    //             <option value="email_verified">Email Verified</option>
    //             <option value="email_unverified">Email Unverified</option>
    //             <option value="done_launching">Done Launching</option>
    //             <option value="confirm_launching">Confirm Launching</option>
    //             <option value="letter_error">Letter Error</option>
    //             <option value="letter_verified">Letter Verified</option>
    //             <option value="done_reregist">Done Re-Registration</option>
    //             <option value="closed">Closed</option>
    //           </select>
    //         </div>
    //         <div className="flex justify-end gap-2">
    //           <button
    //             type="button"
    //             onClick={() => setShowEditModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //             disabled={editLoading}
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="submit"
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //             disabled={editLoading}
    //           >
    //             {editLoading ? <Loader /> : 'Save'}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   )}

    //   {showCreateModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <form
    //         className="bg-white p-6 rounded-lg shadow-xl text-left min-w-[350px] max-w-[600px] w-full"
    //         onSubmit={handleCreateSubmit}
    //       >
    //         <h3 className="text-xl font-bold mb-4">Create User</h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    //           <input
    //             name="fullName"
    //             value={createForm.fullName}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="Full Name"
    //             required
    //           />
    //           <input
    //             name="email"
    //             value={createForm.email}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="Email"
    //             required
    //           />
    //           <input
    //             name="password"
    //             type="password"
    //             value={createForm.password}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="Password"
    //             required
    //           />
    //           <input
    //             name="nim"
    //             value={createForm.nim}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="NIM"
    //             required
    //           />
    //           <input
    //             name="lineId"
    //             value={createForm.lineId}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="LINE ID"
    //             required
    //           />
    //           <input
    //             name="whatsappNumber"
    //             value={createForm.whatsappNumber}
    //             onChange={handleCreateChange}
    //             className="border p-2 rounded w-full"
    //             placeholder="WhatsApp"
    //             required
    //           />
    //           <select
    //             name="regionId"
    //             value={createForm.regionId ?? ''}
    //             onChange={(e) => {
    //               setCreateForm({
    //                 ...createForm,
    //                 regionId: Number(e.target.value),
    //                 facultyId: undefined,
    //                 majorId: undefined,
    //                 lntCourseId: undefined,
    //                 scheduleId: undefined,
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //           >
    //             <option value="">Select Region</option>
    //             {regions.map((r) => (
    //               <option key={r.id} value={r.id}>
    //                 {r.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="facultyId"
    //             value={createForm.facultyId ?? ''}
    //             onChange={(e) => {
    //               setCreateForm({
    //                 ...createForm,
    //                 facultyId: Number(e.target.value),
    //                 majorId: undefined,
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!createForm.regionId}
    //           >
    //             <option value="">Select Faculty</option>
    //             {createFaculties.map((f) => (
    //               <option key={f.id} value={f.id}>
    //                 {f.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="majorId"
    //             value={createForm.majorId ?? ''}
    //             onChange={(e) => {
    //               setCreateForm({
    //                 ...createForm,
    //                 majorId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!createForm.facultyId}
    //           >
    //             <option value="">Select Major</option>
    //             {createMajors.map((m) => (
    //               <option key={m.id} value={m.id}>
    //                 {m.name}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="lntCourseId"
    //             value={createForm.lntCourseId ?? ''}
    //             onChange={(e) => {
    //               setCreateForm({
    //                 ...createForm,
    //                 lntCourseId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!createForm.regionId}
    //           >
    //             <option value="">Select LnT Course</option>
    //             {createLntCourses.map((l) => (
    //               <option key={l.id} value={l.id}>
    //                 {l.title}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="scheduleId"
    //             value={createForm.scheduleId ?? ''}
    //             onChange={(e) => {
    //               setCreateForm({
    //                 ...createForm,
    //                 scheduleId: Number(e.target.value),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //             required
    //             disabled={!createForm.regionId}
    //           >
    //             <option value="">Select Schedule</option>
    //             {createSchedules.map((s) => (
    //               <option key={s.id} value={s.id}>
    //                 {s.title}
    //               </option>
    //             ))}
    //           </select>
    //           <select
    //             name="isJapres"
    //             value={
    //               createForm.isJapres !== null
    //                 ? String(createForm.isJapres)
    //                 : ''
    //             }
    //             onChange={(e) => {
    //               const val = e.target.value;
    //               setCreateForm({
    //                 ...createForm,
    //                 isJapres: val === '' ? null : Number(val),
    //               });
    //             }}
    //             className="border p-2 rounded w-full"
    //           >
    //             <option value="">None</option>
    //             <option value={-1}>Pending</option>
    //             <option value={0}>Rejected</option>
    //             <option value={1}>Accepted Silver</option>
    //             <option value={2}>Accepted Gold</option>
    //           </select>
    //         </div>
    //         <div className="flex justify-end gap-2">
    //           <button
    //             type="button"
    //             onClick={() => setShowCreateModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //             disabled={createLoading}
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="submit"
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //             disabled={createLoading}
    //           >
    //             {createLoading ? <Loader /> : 'Create'}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   )}

    //   {showWhatsAppModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-left w-full max-w-lg">
    //         <h3 className="text-xl font-bold mb-2">
    //           Set WhatsApp Message Template
    //         </h3>
    //         <p className="text-sm text-gray-500 mb-4">
    //           The text{' '}
    //           <code className="bg-gray-200 p-1 rounded">{'{nama}'}</code> will
    //           be replaced with the user's full name.
    //         </p>
    //         <textarea
    //           className="w-full border p-2 rounded min-h-[200px]"
    //           value={tempWhatsAppMessage}
    //           onChange={(e) => setTempWhatsAppMessage(e.target.value)}
    //         />
    //         <div className="flex justify-end space-x-4 mt-6">
    //           <button
    //             onClick={() => setShowWhatsAppModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             onClick={handleSaveWhatsAppMessage}
    //             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    //           >
    //             Save
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {showViewMessageModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-left w-full max-w-lg">
    //         <h3 className="text-xl font-bold mb-4">
    //           Current WhatsApp Message Template
    //         </h3>
    //         <div className="bg-gray-100 p-4 rounded border">
    //           <pre className="whitespace-pre-wrap font-sans text-sm">
    //             {whatsAppMessage}
    //           </pre>
    //         </div>
    //         <div className="flex justify-end mt-6">
    //           <button
    //             onClick={() => setShowViewMessageModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {showDeleteModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-center">
    //         <h3 className="text-xl font-bold mb-4">Delete User</h3>
    //         <p className="text-gray-600 mb-6">
    //           Are you sure you want to delete user{' '}
    //           <span className="font-bold">{deleteTarget}</span>?
    //         </p>
    //         <div className="flex justify-center space-x-4">
    //           <button
    //             onClick={() => setShowDeleteModal(false)}
    //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
    //             disabled={deleting}
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             onClick={handleDeleteConfirm}
    //             className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
    //             disabled={deleting}
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {deleting && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
    //       <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center">
    //         <Loader />
    //         <span className="mt-4 text-gray-700">Deleting user...</span>
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

    //   <div className="flex flex-row flex-wrap items-center gap-4 min-w-fit px-6">
    //     <input
    //       type="text"
    //       placeholder="Search by Full Name..."
    //       value={searchQuery}
    //       onChange={(e) => setSearchQuery(e.target.value)}
    //       className="py-2 px-4 w-full md:w-[400px] border rounded"
    //     />
    //     <div className="flex gap-2">
    //       <button
    //         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    //         onClick={() => setShowCreateModal(true)}
    //         type="button"
    //       >
    //         + Create User
    //       </button>
    //       <button
    //         className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
    //         onClick={() => {
    //           setTempWhatsAppMessage(whatsAppMessage);
    //           setShowWhatsAppModal(true);
    //         }}
    //         type="button"
    //       >
    //         Set WA Message
    //       </button>
    //       <button
    //         className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
    //         onClick={() => setShowViewMessageModal(true)}
    //         type="button"
    //       >
    //         View WA Message
    //       </button>
    //     </div>
    //   </div>
    //   <div className="flex flex-row gap-7 min-w-fit px-6">
    //     <div className="p-5 rounded-[8px] bg-white w-full">
    //       <Table
    //         columns={usersColumns}
    //         data={pagedData}
    //         loading={isLoading}
    //         striped={true}
    //         bordered={true}
    //         className="bg-white rounded-xl shadow-sm"
    //         tableFooter={
    //           <div
    //             className="w-full bg-white z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-4"
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
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                  onClick={downloadUsersExcel}
                  type="button"
                >
                  DOWNLOAD
                </button>
    //           </div>
    //         }
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

export default Users;
