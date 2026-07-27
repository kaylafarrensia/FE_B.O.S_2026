const VARIANTS = {
  card: {
    padding: '2px',
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(153,196,244,0.4) 100%),
      radial-gradient(circle at center, rgba(21,21,21,0.5) 0%, rgba(21,21,21,0) 100%),
      linear-gradient(180deg, rgba(153,196,244,0.3) 0%, rgba(153,196,244,0) 100%),
      radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)
    `,
  },
  subtle: {
    padding: '2px',
    background:
      'linear-gradient(180deg, rgba(153,196,244,0.6) 0%, rgba(153,196,244,0.25) 100%)',
  },
  image: {
    padding: '1px',
    background: 'linear-gradient(135deg, #7ED6F9 0%, #FFFFFF 100%)',
  },
  hover: {
    padding: '3.5px',
    background: `
      linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%),
      radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%),
      linear-gradient(180deg, rgba(111,157,207,0.3) 0%, rgba(111,157,207,0) 100%),
      radial-gradient(circle at center, rgba(111,157,207,1) 0%, rgba(111,157,207,0) 100%)
    `,
  },
  faq: {
    padding: '2px',
    background: `
      linear-gradient(180deg, rgba(153,196,244,0.5) 0%, rgba(153,196,244,0) 100%),
      radial-gradient(circle at center, rgba(153,196,244,0.5) 0%, rgba(153,196,244,0) 100%),
      linear-gradient(180deg, rgba(153,196,244,0.3) 0%, rgba(153,196,244,0) 100%),
      radial-gradient(circle at center, rgba(153,196,244,0.2) 0%, rgba(153,196,244,0.1) 100%)
    `,
  },
}

export default function GradientBorder({
  variant = 'card',
  className = 'rounded-[inherit]',
}) {
  const { padding, background } = VARIANTS[variant]

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        padding,
        background,
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
  )
}
