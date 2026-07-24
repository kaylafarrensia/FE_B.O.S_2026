import gridImage from '../../assets/images/Pattern.svg'

export default function PerspectiveGrid({ className = '' }) {
  return (
    <img
      src={gridImage}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 w-full h-auto select-none ${className}`}
    />
  )
}