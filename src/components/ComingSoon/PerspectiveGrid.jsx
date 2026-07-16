import gridImage from '../../assets/perspective-grid.svg'

export default function PerspectiveGrid({ className = '' }) {
  return (
    <img
      src={gridImage}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none w-full select-none object-cover ${className}`}
    />
  )
}