// Ônibus rodoviário em vista lateral (lado direito, frente para a direita).
// Desenhado em escala: 60 px = 1 metro.
//   deck="single" -> rodoviário de um andar, 14 m, 2 eixos (ex.: Paradiso 1200)
//   deck="double" -> double deck, 15 m, 3 eixos (ex.: Paradiso 1800 DD)
// A carroceria é a mesma para todas as empresas; cada uma só muda a pintura
// (objeto em `paints`, no fim do arquivo).
import { D, T, SEAM, TAIL, LENS, Defs, Shadow, Wheel } from './svgParts.jsx'
import sateliteLogo from '../assets/satelite-norte-logo.webp'

const GROUND = 290
const WHEEL_R = 32
const ARCH_R = 46

const MODELS = {
  single: {
    viewBox: '10 38 900 264',
    front: 860,
    roof: 65,
    // rodas: traseira e dianteira
    axles: [218, 704],
    body:
      'M20 258 V96 Q20 66 50 65 H760 C806 65 834 82 844 112 L860 218 Q864 244 858 262 Q855 271 844 271 H750 A46 46 0 0 0 658 271 H264 A46 46 0 0 0 172 271 H30 Q20 271 20 262 Z',
    ac: [330, 56, 200],
    // faixa de janelas: [x inicial, x final, topo, base]
    windows: [36, 742, 80, 152],
    pillars: [154, 272, 390, 508, 626],
    door: [750, 806, 90, 262],
    windshield: 'M812 78 C828 82 838 94 842 114 L856 214 Q857 222 850 222 H818 Z',
    bays: [264, 658, 216],
    baySeams: [362, 460, 560],
    engine: [30, 160],
    mirror: 'M836 80 Q884 74 890 104 V116',
    mirrorBody: [882, 112],
    headlight: 'M846 226 H862 L861 236 H848 Z',
    belt: 152,
  },
  double: {
    viewBox: '10 20 960 282',
    front: 920,
    roof: 44,
    axles: [196, 274, 762],
    body:
      'M20 258 V78 Q20 44 54 44 H808 C858 44 890 66 902 104 L920 218 Q924 244 918 262 Q915 271 904 271 H808 A46 46 0 0 0 716 271 H322 V252 Q322 225 296 225 H174 Q148 225 148 252 V271 H30 Q20 271 20 262 Z',
    ac: [360, 35, 220],
    windows: [40, 800, 56, 128],
    upperGlass: 'M40 56 H800 C836 56 862 70 874 96 L882 128 H40 Z',
    pillars: [160, 280, 400, 520, 640],
    lowerWindows: [330, 700, 150, 198],
    lowerPillars: [455, 580],
    door: [812, 866, 146, 262],
    windshield: 'M874 136 H888 L906 220 Q906 228 898 228 H884 Z',
    bays: [322, 716, 208],
    baySeams: [420, 520, 620],
    engine: [30, 140],
    mirror: 'M896 60 Q944 56 950 88 V100',
    mirrorBody: [942, 96],
    headlight: 'M906 228 H922 L921 238 H908 Z',
    belt: 128,
    archTrim: ['M144 272 V252 Q144 221 174 221 H296 Q326 221 326 252 V272', 'M713 272 A49 49 0 0 1 811 272'],
  },
}

function starPoints(cx, cy, R, r) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const d = i % 2 === 0 ? R : r
    return `${(cx + Math.cos(a) * d).toFixed(1)},${(cy + Math.sin(a) * d).toFixed(1)}`
  }).join(' ')
}

export function Coach({ deck = 'single', paint, className, title }) {
  const m = MODELS[deck]
  const P = (typeof paint === 'string' ? paints[paint] : paint) || {}
  const p = `coach-${deck}-${P.id || 'base'}`
  const clip = `url(#${p}-shape)`
  const [wx0, wx1, wy0, wy1] = m.windows
  const [dx0, dx1, dy0, dy1] = m.door
  const [bx0, bx1, by] = m.bays
  const [ex0, ex1] = m.engine
  const g = { ...m, clip, p }

  return (
    <svg className={className} viewBox={m.viewBox} role="img" aria-label={title || P.title || 'Ônibus rodoviário'}>
      <Defs p={p} />
      <defs>
        <clipPath id={`${p}-shape`}>
          <path d={m.body} />
        </clipPath>
        <linearGradient id={`${p}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <Shadow cx={(20 + m.front) / 2} cy={GROUND + 3} rx={(m.front - 20) / 2 + 10} />

      {/* ar-condicionado no teto */}
      <rect x={m.ac[0]} y={m.ac[1]} width={m.ac[2]} height={m.roof - m.ac[1] + 2} rx="6" fill={P.ac || '#eef0f2'} stroke={D} strokeWidth="2" />

      {/* carroceria */}
      <path d={m.body} fill={P.body || `url(#${p}-body)`} />
      <g clipPath={clip}>{P.under?.(g)}</g>

      {/* vidros laterais */}
      {deck === 'double' ? (
        <>
          <path d={m.upperGlass} fill={`url(#${p}-glass)`} />
          <rect x={m.lowerWindows[0]} y={m.lowerWindows[2]} width={m.lowerWindows[1] - m.lowerWindows[0]} height={m.lowerWindows[3] - m.lowerWindows[2]} rx="6" fill={`url(#${p}-glass)`} />
          {m.lowerPillars.map((x) => (
            <rect key={x} x={x - 2} y={m.lowerWindows[2]} width="4" height={m.lowerWindows[3] - m.lowerWindows[2]} fill={P.pillar || '#0b1015'} />
          ))}
        </>
      ) : (
        <path d={`M${wx0} ${wy0 + 6} Q${wx0} ${wy0} ${wx0 + 6} ${wy0} H${wx1} V${wy1} H${wx0} Z`} fill={`url(#${p}-glass)`} />
      )}
      {m.pillars.map((x) => (
        <rect key={x} x={x - 2} y={wy0} width="4" height={wy1 - wy0} fill={P.pillar || '#0b1015'} />
      ))}
      {/* reflexo no vidro */}
      <path d={`M${wx0 + 14} ${wy0 + 5} H${wx0 + 330} L${wx0 + 290} ${wy0 + 26} H${wx0 + 14} Z`} fill="rgba(255,255,255,0.08)" />

      {/* porta (à frente do eixo dianteiro) e para-brisa */}
      <rect x={dx0} y={dy0} width={dx1 - dx0} height={dy1 - dy0} rx="6" fill={`url(#${p}-glass)`} stroke={D} strokeWidth="2" />
      <line x1={(dx0 + dx1) / 2} y1={dy0} x2={(dx0 + dx1) / 2} y2={dy1} stroke={D} strokeWidth="2" />
      <path d={m.windshield} fill={`url(#${p}-glass)`} />

      {/* bagageiros e grade do motor */}
      <path
        d={`M${bx0} ${by} H${bx1} ${m.baySeams.map((x) => `M${x} ${by} V262`).join(' ')}`}
        stroke={P.seam || SEAM}
        strokeWidth="1.6"
        fill="none"
      />
      {[bx0, ...m.baySeams].map((x, i, arr) => {
        const next = arr[i + 1] ?? bx1
        return <rect key={x} x={(x + next) / 2 - 9} y="240" width="18" height="4" rx="2" fill={P.seam || '#bdb8b0'} />
      })}
      <g stroke={P.seam || 'rgba(0,0,0,0.16)'} strokeWidth="2">
        {[206, 214, 222, 230, 238].map((y) => (
          <line key={y} x1={ex0} y1={y} x2={ex1} y2={y} />
        ))}
      </g>

      {/* pintura por cima (logos, letreiros, estrelas...) */}
      <g clipPath={clip}>{P.over?.(g)}</g>

      {/* sombreamento geral para dar volume */}
      <path d={m.body} fill={`url(#${p}-shade)`} />
      <path d={m.body} fill="none" stroke={D} strokeWidth="2.5" strokeLinejoin="round" />

      {/* saia, para-choque, luzes */}
      <g clipPath={clip}>
        <rect x="0" y="262" width="1000" height="12" fill={T} />
      </g>
      {(m.archTrim || m.axles.map((x) => `M${x - ARCH_R - 3} 272 A${ARCH_R + 3} ${ARCH_R + 3} 0 0 1 ${x + ARCH_R + 3} 272`)).map((d) => (
        <path key={d} d={d} stroke={T} strokeWidth="5" fill="none" />
      ))}
      {[60, bx0 + 30, (bx0 + bx1) / 2, bx1 - 30, dx0 - 30].map((x) => (
        <rect key={x} x={x} y="252" width="8" height="4" rx="1" fill="#e2731f" />
      ))}
      <path d={`M20 ${m.belt + 4} H27 V${m.belt + 70} H20 Z`} fill={TAIL} />
      <path d={m.headlight} fill={LENS} stroke={T} strokeWidth="2" />

      {/* retrovisor "orelha de coelho" */}
      <path d={m.mirror} stroke={P.mirror || T} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x={m.mirrorBody[0]} y={m.mirrorBody[1]} width="15" height="46" rx="6" fill={P.mirror || T} />

      {m.axles.map((x) => (
        <Wheel key={x} p={p} cx={x} cy={GROUND - WHEEL_R} r={WHEEL_R} rim="chrome" holes={10} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Pinturas                                                            */
/* ------------------------------------------------------------------ */
export const paints = {
  // Satélite Norte: turquesa, frisos brancos e logo na lateral
  sateliteNorte: {
    id: 'sat',
    title: 'Ônibus Satélite Norte',
    body: '#2ba9c2',
    ac: '#2ba9c2',
    seam: 'rgba(0,40,60,0.28)',
    mirror: '#1d3a6b',
    under: (g) => (
      <>
        <rect x="0" y="250" width="1000" height="22" fill="#0b8fae" />
        {/* frisos entre os andares */}
        <rect x="0" y={g.belt + 4} width="1000" height="3" fill="#fff" />
        <rect x="0" y={g.belt + 10} width="1000" height="2" fill="#1d3a6b" />
        {/* asa branca na traseira, como a do pássaro da logo */}
        <path d="M18 254 C110 246 200 234 300 224 C220 242 130 256 18 266 Z" fill="#fff" opacity="0.9" />
        <path d="M18 246 C100 239 180 229 262 221" stroke="#bfe6f3" strokeWidth="3" fill="none" />
      </>
    ),
    over: (g) =>
      g.deck !== 'single' && (
        <image href={sateliteLogo} x="44" y="140" width="250" height={250 / (910 / 265)} />
      ),
  },

  // Estrela Encomendas: branco, teto e janelas azul-marinho, estrela dourada
  estrela: {
    id: 'est',
    title: 'Ônibus Estrela Encomendas',
    mirror: '#2c3f7c',
    under: (g) => {
      const NAVY = '#2c3f7c'
      const [, wx1, wy0, wy1] = g.windows
      return (
        <>
          <rect x="0" y="0" width="1000" height={wy0 + 4} fill={NAVY} />
          <rect x="0" y={wy0} width={wx1 + 8} height={wy1 - wy0 + 6} fill={NAVY} />
          {/* o azul desce pela coluna dianteira até a base do para-brisa */}
          <path d={`M${wx1 + 60} 0 H1000 V232 H${g.front - 14} L${g.front - 30} 120 Q${g.front - 44} ${wy0 + 14} ${wx1 + 66} ${wy0 + 10} Z`} fill={NAVY} />
        </>
      )
    },
    over: (g) => {
      const NAVY = '#2c3f7c'
      const GOLD = '#f0a92a'
      const sx = 150
      const sy = 166
      return (
        <>
          <polygon points={starPoints(sx, sy, 100, 40)} fill="none" stroke={GOLD} strokeWidth="4.5" strokeLinejoin="round" />
          <polygon points={starPoints(sx, sy + 3, 84, 34)} fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points={starPoints(sx - 4, sy + 12, 30, 12)} fill={NAVY} />
          <polygon points={starPoints(sx + 6, sy + 8, 28, 11)} fill="none" stroke={GOLD} strokeWidth="5" strokeLinejoin="round" />
          <text x="284" y="206" fontFamily="Inter Variable, Inter, sans-serif" fontSize="46" fontWeight="800" letterSpacing="4" fill={NAVY}>
            ESTRELA
          </text>
          <text x="640" y="176" fontFamily="Inter Variable, Inter, sans-serif" fontSize="14" fontWeight="700" fill={NAVY}>
            1408
          </text>
          <rect x="700" y="164" width="16" height="16" rx="2" fill="#2f6fc0" />
          <circle cx="708" cy="168.5" r="1.7" fill="#fff" />
          <path d="M705.5 171 v4.5 h4.5 l1.6 2.6" stroke="#fff" strokeWidth="1.5" fill="none" />
        </>
      )
    },
  },
}
