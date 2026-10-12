// Peças compartilhadas pelas ilustrações dos veículos.
export const O = 'var(--orange)'
export const D = '#1d1d1f'
export const T = '#262628' // plásticos pretos
export const SEAM = '#d3cec7' // vincos e recortes de porta
export const TAIL = '#c62d24'
export const LENS = '#dfe5ea'

export function Defs({ p }) {
  return (
    <defs>
      <linearGradient id={`${p}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#f6f4f1" />
        <stop offset="1" stopColor="#e4e0da" />
      </linearGradient>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a5a68" />
        <stop offset="0.55" stopColor="#24303a" />
        <stop offset="1" stopColor="#151c22" />
      </linearGradient>
      <linearGradient id={`${p}-chrome`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f1f1ef" />
        <stop offset="0.5" stopColor="#b9b8b4" />
        <stop offset="1" stopColor="#8e8c88" />
      </linearGradient>
    </defs>
  )
}

export function Shadow({ cx, cy, rx }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry="6" fill="rgba(0,0,0,0.28)" />
}

// Roda com pneu, aro e furos (os furos giram com a classe .moving).
export function Wheel({ cx, cy, r, rim = '#c6c4c0', holes = 8, p }) {
  const ring = Array.from({ length: holes }, (_, i) => {
    const a = (i / holes) * Math.PI * 2
    return [cx + Math.cos(a) * r * 0.4, cy + Math.sin(a) * r * 0.4]
  })
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#18181a" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="none" stroke="#2c2c2f" strokeWidth={r * 0.06} />
      <circle cx={cx} cy={cy} r={r * 0.64} fill={rim === 'chrome' ? `url(#${p}-chrome)` : rim} />
      <circle cx={cx} cy={cy} r={r * 0.56} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={r * 0.04} />
      <g className="hub" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {ring.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={r * 0.075} fill="rgba(0,0,0,0.55)" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r * 0.2} fill="rgba(255,255,255,0.35)" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.07} fill="#3a3a3c" />
    </g>
  )
}

// Logo oficial aplicada na lateral do veículo. (x, y) = canto inferior esquerdo
// aproximado do nome, como no texto que existia antes.
