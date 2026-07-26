export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border-1 border-[#99C4F4] bg-gradient-to-br from-[#f7f7f524] via-[#f7f7f524] to-[#7ed6f911] p-6 shadow-xl backdrop-blur-md sm:p-8 md:p-10 ${className}`}
    >
      {children}
    </div>
  )
}