export default function PaymentStatusButton({ isPaid }) {
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
        ${
          isPaid
            ? 'bg-gradient-to-r from-[#166313] to-[#2DC927]'
            : 'bg-gradient-to-r from-[#992C3D] to-[#FF2A4A]'
        }
      `}
    >
      {isPaid ? 'Paid' : 'Unpaid'}
    </button>
  );
}