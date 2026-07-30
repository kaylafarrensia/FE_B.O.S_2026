export default function PersonIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* kepala kecil kiri-atas, abu-abu */}
      <circle cx="55" cy="45" r="38" fill="#B9C6D4" />
      {/* kepala kecil kanan, biru */}
      <circle cx="150" cy="75" r="30" fill="#3A7FC1" />
      {/* badan/bahu kiri, abu-abu, di belakang */}
      <path
        d="M0 200 C0 140 40 100 95 100 C130 100 155 122 160 160 L160 200 Z"
        fill="#AEBDCE"
      />
      {/* badan/bahu kanan, biru, di depan */}
      <path
        d="M60 200 C60 145 100 108 155 108 C195 108 220 140 220 180 L220 200 Z"
        fill="#3A7FC1"
      />
    </svg>
  )
}