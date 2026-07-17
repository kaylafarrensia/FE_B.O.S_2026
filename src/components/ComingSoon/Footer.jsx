export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center py-10">
      <div
        className="relative w-full max-w-[1490px] h-[260px] mx-4 rounded-xl overflow-hidden 
                   bg-gradient-to-b from-transparent via-[#13528e] to-[#0A2745]
                   flex items-center justify-center"
      >
        {/* Grid lantai perspektif */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg) scale(2)",
            transformOrigin: "center 30%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
          }}
        />

        {/* Logo BNCC */}
        <img
          src="/public/images/img-bncc-logo.png"
          alt="BNCC Logo"
          className="relative z-10 w-[193px] h-[56px] opacity-100"
        />
      </div>
    </footer>
  )
}