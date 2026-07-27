export default function Card({ children, className = '' }) {
  return (
    <div
      className={`glassmorphism rounded-[20px] p-8 sm:p-10 border-white/60 border shadow-md ${className}`}
      style={{
        '--glass-from': 'rgba(255, 255, 255, 0.45)',
        '--glass-to': 'rgba(223, 239, 255, 0.35)',
        '--glass-stroke': 'rgba(255, 255, 255, 0.6)',
      }}
    >
      {children}
    </div>
  );
}