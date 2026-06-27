// Sol de Mayo: elemento firma de la marca. Se dibuja con currentColor,
// así que toma el color del contexto (dorado en el hero, etc.).
export default function SolDeMayo({ size = 200, className, rayos = 24, style }) {
  const c = 100
  const rInterno = 34
  const rRayoBase = 40
  const rRayoPunta = 92

  const puntas = Array.from({ length: rayos }, (_, i) => {
    const ang = (i / rayos) * Math.PI * 2
    const ancho = (Math.PI / rayos) * 0.72
    const x1 = c + rRayoBase * Math.cos(ang - ancho)
    const y1 = c + rRayoBase * Math.sin(ang - ancho)
    const x2 = c + rRayoPunta * Math.cos(ang)
    const y2 = c + rRayoPunta * Math.sin(ang)
    const x3 = c + rRayoBase * Math.cos(ang + ancho)
    const y3 = c + rRayoBase * Math.sin(ang + ancho)
    return `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} Z`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={puntas} opacity="0.92" />
      <circle cx={c} cy={c} r={rInterno} />
      <circle cx={c} cy={c} r={rInterno - 8} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </svg>
  )
}
