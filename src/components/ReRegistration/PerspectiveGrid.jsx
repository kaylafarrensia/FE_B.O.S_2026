import gridImage from '../../../public/images/img-grid-reregist.svg'

export default function PerspectiveGrid({ className = '' }) {
  return (
    <img
      src={gridImage}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none w-full select-none object-cover ${className} opacity-60`}
    />
  )
}
