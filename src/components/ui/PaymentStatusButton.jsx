export default function PaymentStatusButton({ status = 'unpaid' }) {
  // Mapping warna background berdasarkan status
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return {
          label: 'Paid',
          bgClass: 'bg-gradient-to-r from-[#166313] to-[#2DC927]',
        };
      case 'pending':
        return {
          label: 'Pending',
          bgClass: 'bg-gradient-to-r from-[#676E0C] to-[#FFEE00]', // Warna kuning/oranye untuk pending
        };
      case 'unpaid':
      default:
        return {
          label: 'Unpaid',
          bgClass: 'bg-gradient-to-r from-[#992C3D] to-[#FF2A4A]',
        };
    }
  };

  const { label, bgClass } = getStatusStyle();

  return (
    <button
      disabled
      className={`
        px-6 
        py-2 
        rounded-full 
        text-sm 
        font-semibold 
        text-white 
        cursor-default
        ${bgClass}
      `}
    >
      {label}
    </button>
  );
}