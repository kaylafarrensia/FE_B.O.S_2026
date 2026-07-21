// import { ITableColumn } from '@/components';

const statusMap = {
  email_verified: { color: 'bg-[#56BA28]', label: 'Email Verified' },
  email_unverified: { color: 'bg-[#FF1F25]', label: 'Email Unverified' },
  done_launching: { color: 'bg-[#0057FC]', label: 'Done Launching' },
  confirm_launching: { color: 'bg-[#F4B81D]', label: 'Confirm Launching' },
  letter_error: { color: 'bg-[#FF1F25]', label: 'Letter Error' },
  letter_verified: { color: 'bg-[#00D4F8]', label: 'Letter Verified' },
  done_reregist: { color: 'bg-[#D59DE6]', label: 'Done Re-Registration' },
  closed: { color: 'bg-[#251369]', label: 'Closed' },
  null: { color: 'bg-[#CED4DA]', label: 'N/A' },
  undefined: { color: 'bg-[#CED4DA]', label: 'N/A' },
};

const paymentStatusMap = {
  pending: { color: 'bg-[#F4B81D]', label: 'Pending' },
  paid: { color: 'bg-[#56BA28]', label: 'Paid' },
  unpaid: { color: 'bg-[#FF1F25]', label: 'Unpaid' },
  refunded: { color: 'bg-[#0057FC]', label: 'Refunded' },
  null: { color: 'bg-[#CED4DA]', label: 'N/A' },
  undefined: { color: 'bg-[#CED4DA]', label: 'N/A' },
};

const japresStatusMap = {
  'accepted gold': { color: 'bg-[#FFD700]', label: 'Accepted Gold' },
  'accepted silver': { color: 'bg-[#C0C0C0]', label: 'Accepted Silver' },
  rejected: { color: 'bg-[#FF1F25]', label: 'Rejected' },
  pending: { color: 'bg-[#F4B81D]', label: 'Pending' },
  null: { color: 'bg-[#CED4DA]', label: 'N/A' },
  undefined: { color: 'bg-[#CED4DA]', label: 'N/A' },
};

const blastStatusMap = {
  success: { color: 'bg-[#56BA28]', label: 'Success' },
  failed: { color: 'bg-[#FF1F25]', label: 'Failed' },
  pending: { color: 'bg-[#F4B81D]', label: 'Pending' },
  null: { color: 'bg-[#CED4DA]', label: 'N/A' },
  undefined: { color: 'bg-[#CED4DA]', label: 'N/A' },
};

export const usersColumns = [
  { title: 'ID', itemAlign: 'center', headerAlign: 'center', width: '50px' },
  { title: 'BNCC ID', itemAlign: 'left', width: '160px' },
  { title: 'Full Name', itemAlign: 'left', width: '250px' },
  {
    title: 'Status',
    itemAlign: 'left',
    width: '200px',
    itemWrapper: (item) => {
      const value = typeof item === 'string' ? item : String(item ?? '');
      const status = statusMap[value.toLowerCase()] || {
        color: 'bg-gray-400',
        label: value,
      };
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-[#DEE2E6] ${status.color}`}
          ></span>
          <span>{status.label}</span>
        </span>
      );
    },
  },
  { title: 'Email', itemAlign: 'left', width: '160px' },
  { title: 'LINE', itemAlign: 'left', width: '160px' },
  { title: 'WhatsApp', itemAlign: 'left', width: '160px' },
  { title: 'NIM', itemAlign: 'left', width: '160px' },
  { title: 'LnT Course', itemAlign: 'left', width: '160px' },
  { title: 'Launching Schedule', itemAlign: 'left', width: '160px' },
  { title: 'Major', itemAlign: 'left', width: '160px' },
  { title: 'Faculty', itemAlign: 'left', width: '160px' },
  { title: 'Region', itemAlign: 'left', width: '160px' },
  { title: 'Actions', itemAlign: 'left', width: '140px' },
];

export const documentsColumns = [
  { title: 'ID', itemAlign: 'center', headerAlign: 'center', width: '50px' },
  { title: 'BNCC ID', itemAlign: 'left', width: '160px' },
  { title: 'Full Name', itemAlign: 'left', width: '250px' },
  { title: 'Region', itemAlign: 'left', width: '160px' },
  { title: 'Member Letter', itemAlign: 'left', width: '160px' },
  { title: 'Binusian Card', itemAlign: 'left', width: '160px' },
  { title: 'LinkedIn', itemAlign: 'left', width: '160px' },
  { title: 'Github', itemAlign: 'left', width: '160px' },
];

export const paymentColumns = [
  { title: 'ID', itemAlign: 'center', headerAlign: 'center', width: '50px' },
  { title: 'BNCC ID', itemAlign: 'left', width: '160px' },
  { title: 'Full Name', itemAlign: 'left', width: '250px' },
  { title: 'Region', itemAlign: 'left', width: '160px' },
  {
    title: 'JaPres Type',
    itemAlign: 'left',
    width: '200px',
    itemWrapper: (item) => {
      const value = typeof item === 'string' ? item : String(item ?? '');
      const status = japresStatusMap[value.toLowerCase()] || {
        color: 'bg-gray-400',
        label: value,
      };
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-[#DEE2E6] ${status.color}`}
          ></span>
          <span>{status.label}</span>
        </span>
      );
    },
  },
  {
    title: 'Payment Status',
    itemAlign: 'left',
    width: '200px',
    itemWrapper: (item) => {
      const value = typeof item === 'string' ? item : String(item ?? '');
      const status = paymentStatusMap[value.toLowerCase()] || {
        color: 'bg-gray-400',
        label: value,
      };
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-[#DEE2E6] ${status.color}`}
          ></span>
          <span>{status.label}</span>
        </span>
      );
    },
  },
  { title: 'Order ID', itemAlign: 'left', width: '160px' },
  { title: 'Amount', itemAlign: 'left', width: '160px' },
  { title: 'Payment Proof', itemAlign: 'center', width: '100px' },
  { title: 'Actions', itemAlign: 'center', width: '60px' },
];

export const japresColumns = [
  { title: 'ID', itemAlign: 'center', headerAlign: 'center', width: '50px' },
  { title: 'Email', itemAlign: 'left', width: '160px' },
  { title: 'Full Name', itemAlign: 'left', width: '250px' },
  { title: 'Region', itemAlign: 'left', width: '160px' },
  { title: 'Link Drive', itemAlign: 'left', width: '160px' },
  {
    title: 'JaPres Type',
    itemAlign: 'left',
    width: '200px',
    itemWrapper: (item) => {
      const value = typeof item === 'string' ? item : String(item ?? '');
      const status = japresStatusMap[value.toLowerCase()] || {
        color: 'bg-gray-400',
        label: value,
      };
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-[#DEE2E6] ${status.color}`}
          ></span>
          <span>{status.label}</span>
        </span>
      );
    },
  },
  { title: 'Submit Date', itemAlign: 'left', width: '160px' },
  { title: 'Actions', itemAlign: 'center', width: '60px' },
];

export const subscriptionColumns = [
  { title: 'ID', itemAlign: 'center', headerAlign: 'center', width: '50px' },
  { title: 'Created At', itemAlign: 'left', width: '160px' },
  { title: 'Email', itemAlign: 'left', width: '160px' },
  {
    title: 'Status',
    itemAlign: 'left',
    width: '200px',
    itemWrapper: (item) => {
      const value = typeof item === 'string' ? item : String(item ?? '');
      const status = blastStatusMap[value.toLowerCase()] || {
        color: 'bg-gray-400',
        label: value,
      };
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-[#DEE2E6] ${status.color}`}
          ></span>
          <span>{status.label}</span>
        </span>
      );
    },
  },
  { title: 'Blast Time', itemAlign: 'left', width: '160px' },
];
