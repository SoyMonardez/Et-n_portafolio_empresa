// Silueta de la cordillera (San Juan) para la base del hero.
// Dos capas para dar profundidad.
export default function Cordillera({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        opacity="0.5"
        d="M0,220 L120,150 L240,200 L360,110 L500,190 L640,90 L780,170 L920,120 L1080,200 L1220,140 L1340,190 L1440,150 L1440,320 L0,320 Z"
      />
      <path
        fill="currentColor"
        d="M0,260 L160,190 L300,250 L440,170 L580,240 L720,160 L880,250 L1020,190 L1180,260 L1320,200 L1440,250 L1440,320 L0,320 Z"
      />
    </svg>
  )
}
