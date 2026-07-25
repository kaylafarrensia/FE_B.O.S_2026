export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-4 sm:pt-6">
      <div
        className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden
                   bg-gradient-to-b from-transparent via-[#13528e] to-[#0A2745]
                   flex items-center justify-center
                   h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 max-h-[260px]"
      >
        {/* Grid lantai perspektif */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)
            `,
            backgroundSize: 'clamp(24px, 2vw, 40px) clamp(24px, 2vw, 40px)',
            transform: 'perspective(500px) rotateX(60deg) scale(2)',
            transformOrigin: 'center 30%',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          }}
        />

        {/* Logo BNCC */}
        <img
          src="/images/img-bncc-logo.png"
          alt="BNCC Logo"
          className="relative z-10 w-28 sm:w-36 md:w-44 lg:w-52 xl:w-56 h-auto object-contain opacity-100"
        />
      </div>
    </footer>
  )
}
