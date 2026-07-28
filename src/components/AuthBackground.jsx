export default function AuthBackground({ children }) {
  return (
    <div className="relative isolate min-h-svh min-w-80 overflow-hidden bg-[linear-gradient(180deg,#f9fcff_0%,#f9fcff_28%,#d8ecff_100%)] font-montserrat text-[#0b2c4e] max-[760px]:overflow-y-auto [@media(max-height:850px)_and_(min-width:761px)]:overflow-y-auto">
      {/* ── Background SVG Layers & Bottom Glow ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-1 size-full max-[760px]:fixed"
        aria-hidden="true"
      >
        <img className="absolute inset-0 size-full object-cover" src="/images/bg-line.svg" alt="" />
        <img className="absolute inset-0 size-full object-cover" src="/images/gradient-circles.svg" alt="" />
        <div className="absolute inset-0 size-full [background:radial-gradient(ellipse_85%_58%_at_50%_120%,#104b82_0%,#104b82_30%,#1c5b97eb_48%,#387ebea6_68%,#6fa9de2e_84%,transparent_100%),linear-gradient(180deg,transparent_78%,#2069aa8f_100%)]" />
      </div>

      {children}
    </div>
  )
}
