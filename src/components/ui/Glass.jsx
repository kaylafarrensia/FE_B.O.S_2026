/**
 * Glass — liquid glass morphism component.
 * Renders the three layer divs (effect, tint, shine) + the SVG distortion
 * filter required by .liquidGlass-effect { filter: url(#glass-distortion) }.
 */
function Glass({ className }) {
  const buildClassName = (base) => [base, className].filter(Boolean).join(' ');

  return (
    <>
      {/* SVG filter — only needs to exist once in the DOM, harmless if repeated */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className={buildClassName('liquidGlass-effect')} />
      <div className={buildClassName('liquidGlass-tint')} />
      <div className={buildClassName('liquidGlass-shine')} />
    </>
  );
}

export default Glass;