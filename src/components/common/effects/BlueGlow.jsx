export default function BlueGlow({
  className = '',
  color = '#ACD6FF',
  opacity = 0.55,
  blur = 50,
}) {
  return (
    <div
      className={`absolute pointer-events-none rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle,
          ${color} 0%,
          ${color}99 30%,
          ${color}40 55%,
          transparent 80%)`,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    />
  )
}
