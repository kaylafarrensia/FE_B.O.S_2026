import patternTop from '../../../assets/patterns/pattern-top.svg'

export default function PatternTop({ className = '' }) {
  return (
    <img
      src={patternTop}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none h-full w-full select-none object-cover ${className}`}
    />
  )
}
