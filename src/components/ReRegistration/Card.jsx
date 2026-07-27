export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[12px] border-1 border-[#99C4F4] bg-gradient-to-br from-[#f7f7f5b4] via-[#f7f7f56f] to-[#7ed6f93d] p-4 backdrop-blur-md sm:p-8 md:py-4 md:px-10 ${className}`}
    >
      {children}
    </div>
  )
}