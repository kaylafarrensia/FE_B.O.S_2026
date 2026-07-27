import GradientBorder from '../effects/GradientBorder.jsx'

const BACKGROUNDS = {
  corner:
    'radial-gradient(120% 120% at 0% 0%, rgba(153,196,244,0.20) 0%, rgba(153,196,244,0.10) 100%)',
  center:
    'radial-gradient(circle at center, rgba(153,196,244,0.2) 0%, rgba(153,196,244,0.1) 100%)',
}

export default function GlassCard({
  children,
  className = '',
  rounded = 'rounded-2xl',
  bg = 'corner',
  borderVariant,
  as: Tag = 'div',
  ...rest
}) {
  return (
    <Tag
      className={`relative ${rounded} backdrop-blur-md ${className}`}
      style={{ background: BACKGROUNDS[bg] }}
      {...rest}
    >
      {children}
      <GradientBorder variant={borderVariant} className={rounded} />
    </Tag>
  )
}
