export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border-2 border-[#99BDDF] bg-gradient-to-br from-[#DFEFFF] via-[#DFEFFF] to-[#5393CF4D] p-6 shadow-xl backdrop-blur-md sm:p-8 md:p-10 ${className}`}
    >
      {children}
    </div>
  )
}