export default function WhiteGlow({ className = '', blur = 90 }) {
  return (
    <div
      className={`absolute pointer-events-none rounded-full ${className}`}
      style={{
        background: `
          radial-gradient(
            circle,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,.8) 30%,
            rgba(255,255,255,.35) 60%,
            transparent 85%
          )
        `,
        filter: `blur(${blur}px)`,
      }}
    />
  )
}
