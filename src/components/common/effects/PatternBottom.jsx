import patternBottom from '../../../assets/patterns/pattern-bottom.svg'

export default function PatternBottom({ className = '' }) {
  return (
    <img
      src={patternBottom}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none w-full select-none object-cover ${className}`}
    />
  )
}
