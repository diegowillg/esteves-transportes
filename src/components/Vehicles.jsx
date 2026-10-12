import logoH from '../assets/logo-esteves-h.png'

// Ilustrações vetoriais da frota (vista lateral, voltadas para a direita).
// Padrão visual: carroceria branca, marca Esteves, faixa laranja,
// para-choques e molduras em preto.
import { O, D, T, SEAM, TAIL, LENS, Defs, Shadow, Wheel } from './svgParts.jsx'
import { Coach } from './Coach.jsx'

function Brand({ x, y, size }) {
  const w = size * 5.4
  const h = (w * 200) / 1112
  return <image href={logoH} x={x} y={y - h * 0.78} width={w} height={h} />
}

/* ------------------------------------------------------------------ */
/* Fiat Fiorino furgão teto alto                                       */
/* ------------------------------------------------------------------ */
export function Fiorino({ className, brand = true, title = 'Fiat Fiorino' }) {
  const p = 'fio'
  return (
    <svg className={className} viewBox="26 58 544 244" role="img" aria-label={title}>
      <Defs p={p} />
      <Shadow cx={298} cy={295} rx={262} />
      {/* carroceria */}
      <path
        d="M40 84 Q40 70 54 70 H236 Q250 70 255 79 L262 88 H334 Q343 88 349 94 L436 156 Q443 161 454 163 L526 177 Q546 181 551 199 L554 224 V250 H521 A46 46 0 0 0 429 250 H176 A46 46 0 0 0 84 250 H40 Z"
        fill={`url(#${p}-body)`}
        stroke={D}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* reforço lateral do baú e tampa do tanque */}
      <rect x="64" y="86" width="180" height="96" rx="14" fill="none" stroke="#e3dfd9" strokeWidth="2" />
      <rect x="136" y="200" width="20" height="18" rx="4" fill="none" stroke={SEAM} strokeWidth="2" />
      {/* para-brisa (borda) e janela da porta */}
      <rect x="262" y="98" width="12" height="78" fill={T} />
      <path
        d="M274 104 H340 Q346 104 351 108 L412 166 Q416 174 406 174 H274 Z"
        fill={`url(#${p}-glass)`}
      />
      <path d="M282 110 H330 L300 150 H282 Z" fill="rgba(255,255,255,0.08)" />
      {/* recortes da porta e maçaneta */}
      <path d="M262 92 V246 M437 162 Q428 200 432 246" stroke={SEAM} strokeWidth="2" fill="none" />
      <rect x="284" y="180" width="24" height="6" rx="3" fill={T} />
      {/* retrovisor */}
      <path d="M396 168 Q398 160 410 158 H418 Q424 158 424 166 V178 Q424 184 418 184 H404 Q396 184 396 176 Z" fill={T} />
      {/* faixa laranja e marca */}
      <rect x="42" y="190" width="380" height="6" fill={O} />
      {brand && <Brand x={80} y={146} size={32} />}
      {/* frisos, caixas de roda e para-choques */}
      <rect x="186" y="226" width="232" height="13" rx="4" fill={T} />
      <path d="M424 252 A51 51 0 0 1 526 252 M79 252 A51 51 0 0 1 181 252" stroke={T} strokeWidth="9" fill="none" />
      <path d="M37 216 H72 V252 Q72 262 62 262 H46 Q37 262 37 253 Z" fill={T} />
      <path d="M523 214 Q540 209 552 212 Q561 216 561 230 V252 Q561 262 551 262 H524 Q527 240 523 214 Z" fill={T} />
      <rect x="540" y="200" width="16" height="9" rx="3" fill={T} />
      {/* lanternas e farol */}
      <path d="M35 102 Q35 98 39 98 H46 V198 H39 Q35 198 35 194 Z" fill={TAIL} />
      <rect x="38" y="106" width="5" height="34" rx="2" fill="#e8574a" />
      <path d="M512 175 L545 181 Q552 185 551 194 L520 191 Q510 186 512 175 Z" fill={LENS} stroke={T} strokeWidth="2" />
      <rect x="520" y="180" width="9" height="6" rx="2" fill="#f2a33a" />
      <Wheel p={p} cx={475} cy={258} r={37} rim="chrome" holes={8} />
      <Wheel p={p} cx={130} cy={258} r={37} rim="chrome" holes={8} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Fiat Strada Endurance com capota alta                               */
/* ------------------------------------------------------------------ */
export function Strada({ className, brand = true, title = 'Fiat Strada com capota alta' }) {
  const p = 'str'
  return (
    <svg className={className} viewBox="26 52 552 250" role="img" aria-label={title}>
      <Defs p={p} />
      <Shadow cx={302} cy={295} rx={266} />
      {/* picape */}
      <path
        d="M40 150 H298 V110 Q298 102 306 102 H348 Q356 102 361 107 L428 156 Q435 161 446 162 L524 172 Q548 176 555 196 L560 224 V250 H527 A46 46 0 0 0 433 250 H180 A46 46 0 0 0 88 250 H40 Z"
        fill={`url(#${p}-body)`}
        stroke={D}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M48 156 V246" stroke={SEAM} strokeWidth="2" />
      {/* capota alta de fibra, com defletor sobre a cabine */}
      <path
        d="M42 76 Q42 62 56 62 H266 Q280 62 291 70 L346 106 H300 V152 H42 Z"
        fill={`url(#${p}-body)`}
        stroke={D}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="58" y="74" width="204" height="66" rx="10" fill="none" stroke="#e3dfd9" strokeWidth="2" />
      <rect x="42" y="148" width="258" height="6" fill="#3a3a3c" />
      {/* para-brisa e janela */}
      <path d="M308 112 H346 Q352 112 357 116 L406 160 Q410 168 400 168 H308 Z" fill={`url(#${p}-glass)`} />
      <path d="M314 117 H340 L322 150 H314 Z" fill="rgba(255,255,255,0.08)" />
      <path d="M300 106 V246 M431 162 Q424 200 428 246" stroke={SEAM} strokeWidth="2" fill="none" />
      <rect x="316" y="180" width="22" height="6" rx="3" fill={T} />
      <path d="M392 162 Q394 154 404 152 H414 Q420 152 420 160 V172 Q420 178 414 178 H400 Q392 178 392 170 Z" fill={T} />
      {/* faixa laranja, marca e adesivo lateral escuro */}
      <rect x="44" y="190" width="380" height="6" fill={O} />
      {brand && <Brand x={70} y={120} size={32} />}
      <rect x="184" y="226" width="244" height="8" rx="3" fill={T} />
      {/* alargadores, para-choques, luzes */}
      <path d="M426 252 A53 53 0 0 1 534 252 M81 252 A53 53 0 0 1 187 252" stroke={T} strokeWidth="12" fill="none" />
      <path d="M528 194 Q548 192 558 198 Q567 205 567 222 V252 Q567 262 557 262 H530 Q533 232 528 194 Z" fill={T} />
      <path d="M36 218 H74 V254 Q74 262 64 262 H44 Q36 262 36 254 Z" fill={T} />
      <path d="M36 158 H46 V202 H36 Z" fill={TAIL} />
      <path d="M512 167 L547 173 Q555 179 552 188 L520 186 Q510 180 512 167 Z" fill={LENS} stroke={T} strokeWidth="2" />
      <Wheel p={p} cx={480} cy={258} r={36} rim="#3b3b3e" holes={6} />
      <Wheel p={p} cx={134} cy={258} r={36} rim="#3b3b3e" holes={6} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Cavalo mecânico (estilo Volvo FH) + carreta baú 3 eixos             */
/* ------------------------------------------------------------------ */
// livery: pintura de transportadora parceira { body, accent, spots, mark, word }
export function Carreta({ className, brand = true, livery, title = 'Carreta baú' }) {
  const p = 'car'
  const L = livery
  const seams = Array.from({ length: 14 }, (_, i) => 68 + i * 48)
  const bodyFill = L ? L.body : `url(#${p}-body)`
  const spots = [
    [14, 12, 9, 6], [44, 30, 6, 8], [70, 10, 7, 5], [28, 52, 8, 6], [62, 56, 5, 7], [86, 38, 6, 5], [8, 34, 4, 5],
  ]
  return (
    <svg className={className} viewBox="10 18 978 284" role="img" aria-label={title}>
      <Defs p={p} />
      {L && (
        <defs>
          <pattern id={`${p}-spots`} width="96" height="68" patternUnits="userSpaceOnUse">
            {spots.map(([x, y, rx, ry], i) => (
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={L.spots} />
            ))}
          </pattern>
        </defs>
      )}
      <Shadow cx={496} cy={294} rx={482} />
      {/* chassi do cavalo */}
      <rect x="640" y="214" width="330" height="14" fill={D} />
      {/* baú */}
      <rect x="20" y="36" width="714" height="178" rx="4" fill={bodyFill} stroke={D} strokeWidth="2.5" />
      {L && <rect x="22" y="47" width="710" height="125" fill={`url(#${p}-spots)`} />}
      {seams.map((x) => (
        <line key={x} x1={x} y1="46" x2={x} y2="204" stroke={L ? 'rgba(255,255,255,0.05)' : '#e9e5df'} strokeWidth="1.5" />
      ))}
      <rect x="21.5" y="37.5" width="711" height="9" fill={L ? L.accent : '#dcd8d1'} />
      <rect x="21.5" y="203" width="711" height="9.5" fill={L ? '#111' : '#cfcac2'} />
      <rect x="20" y="174" width="714" height="12" fill={L ? L.accent : O} />
      {L && <rect x="20" y="190" width="714" height="3" fill={L.accent} />}
      {brand && !L && <Brand x={66} y={138} size={86} />}
      {L && (
        <>
          <image href={L.mark} x="34" y="40" width="182" height="135" />
          <image href={L.word} x="272" y="66" width="430" height="102" />
        </>
      )}
      {brand && !L && <text x="728" y="164" textAnchor="end" fontFamily="Inter Variable, Inter, sans-serif" fontSize="15" fontWeight="700" fill="#6b6762">
        estevestransportes.com.br
      </text>}
      {[34, 268, 500, 722].map((x) => (
        <rect key={x} x={x} y="196" width="8" height="5" rx="1" fill="#f2a33a" />
      ))}
      {/* longarina, protetor lateral, pés de apoio, para-choque */}
      <rect x="24" y="214" width="706" height="12" fill={D} />
      <rect x="300" y="232" width="240" height="5" fill="#9a9893" />
      <rect x="320" y="226" width="4" height="10" fill="#7b7974" />
      <rect x="516" y="226" width="4" height="10" fill="#7b7974" />
      <rect x="580" y="226" width="9" height="40" fill="#3a3a3c" />
      <rect x="574" y="264" width="21" height="5" fill="#3a3a3c" />
      <rect x="44" y="226" width="6" height="14" fill={D} />
      <rect x="26" y="238" width="46" height="7" fill={D} />
      <path d="M60 236 Q60 222 76 222 H248 Q264 222 264 236" stroke={T} strokeWidth="6" fill="none" />
      {/* cabine */}
      <path
        d="M766 56 Q766 34 788 34 H928 Q946 34 950 50 L958 140 L962 206 H766 Z"
        fill={bodyFill}
        stroke={D}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M926 34 Q946 34 950 50 L952 58 H932 Z" fill={T} />
      <rect x="774" y="62" width="54" height="104" rx="8" fill="none" stroke={L ? '#2a2a2a' : '#e3dfd9'} strokeWidth="2" />
      {L && <path d="M768 150 L834 112 H850 L784 150 Z" fill={L.accent} />}
      <path d="M948 60 L956 142 H946 L940 60 Z" fill={`url(#${p}-glass)`} />
      <path
        d="M842 64 H930 Q937 64 938 71 L943 128 Q943 134 937 134 H920 L911 142 H842 Z"
        fill={`url(#${p}-glass)`}
      />
      <path d="M850 70 H900 L872 112 H850 Z" fill="rgba(255,255,255,0.08)" />
      <path d="M834 58 V204 M946 62 L953 204" stroke={SEAM} strokeWidth="2" fill="none" />
      <rect x="848" y="150" width="22" height="5" rx="2" fill={T} />
      <rect x="768" y="176" width="190" height="10" fill={L ? L.accent : O} />
      {brand && !L && <Brand x={846} y={170} size={17} />}
      {L && <image href={L.word} x="844" y="144" width="96" height="23" />}
      {/* degraus, para-choque, farol, grade, espelho */}
      <rect x="860" y="206" width="70" height="32" rx="3" fill={T} />
      <path d="M866 218 H924 M866 230 H924" stroke="#55555a" strokeWidth="2" />
      <path d="M922 206 H962 Q976 208 976 222 V244 Q976 252 966 252 H930 Q936 228 922 206 Z" fill={T} />
      <path d="M858 252 A48 48 0 0 1 954 252" stroke={T} strokeWidth="8" fill="none" />
      <path d="M652 236 Q652 222 668 222 H758 Q774 222 774 236" stroke={T} strokeWidth="7" fill="none" />
      <rect x="958" y="144" width="8" height="44" fill={T} />
      <path d="M956 190 H972 V203 H958 Z" fill={LENS} stroke={T} strokeWidth="2" />
      <path d="M950 72 Q966 70 970 80" stroke={T} strokeWidth="4" fill="none" />
      <rect x="966" y="76" width="12" height="52" rx="4" fill={T} />
      {/* tanque de combustível */}
      <rect x="790" y="214" width="66" height="34" rx="14" fill={`url(#${p}-chrome)`} stroke="#8d8a85" strokeWidth="1.5" />
      <Wheel p={p} cx={98} cy={258} r={30} rim="chrome" holes={10} />
      <Wheel p={p} cx={162} cy={258} r={30} rim="chrome" holes={10} />
      <Wheel p={p} cx={226} cy={258} r={30} rim="chrome" holes={10} />
      <Wheel p={p} cx={682} cy={258} r={30} rim="chrome" holes={10} />
      <Wheel p={p} cx={746} cy={258} r={30} rim="chrome" holes={10} />
      <Wheel p={p} cx={906} cy={258} r={30} rim="chrome" holes={10} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* VW Delivery 11.180 com baú (caminhão leve, cabine avançada)          */
/* Escala 60 px = 1 m: entre-eixos 4,0 m, cabine 2,39 m de altura,      */
/* baú com ~3,35 m de altura total e rodas aro 17,5".                   */
/* ------------------------------------------------------------------ */
export function Delivery({ className, brand = true, title = 'VW Delivery com baú' }) {
  const p = 'dlv'
  const seams = [71, 110, 149, 188, 227, 266, 305]
  return (
    <svg className={className} viewBox="20 26 466 222" role="img" aria-label={title}>
      <Defs p={p} />
      <Shadow cx={252} cy={241} rx={226} />
      {/* chassi */}
      <rect x="40" y="183" width="420" height="12" fill={D} />
      {/* baú */}
      <rect x="32" y="40" width="312" height="145" rx="3" fill={`url(#${p}-body)`} stroke={D} strokeWidth="2.5" />
      {seams.map((x) => (
        <line key={x} x1={x} y1="47" x2={x} y2="178" stroke="#e9e5df" strokeWidth="1.5" />
      ))}
      <rect x="33.5" y="41.5" width="309" height="6" fill="#dcd8d1" />
      <rect x="33.5" y="177" width="309" height="6.5" fill="#cfcac2" />
      <rect x="32" y="156" width="312" height="8" fill={O} />
      {brand && <Brand x={56} y={120} size={40} />}
      {brand && (
        <text x="338" y="150" textAnchor="end" fontFamily="Inter Variable, Inter, sans-serif" fontSize="9" fontWeight="700" fill="#6b6762">
          estevestransportes.com.br
        </text>
      )}
      <rect x="30" y="184" width="7" height="12" rx="1" fill={TAIL} />
      {/* para-choque traseiro, protetor lateral, tanque */}
      <rect x="30" y="198" width="30" height="6" fill={D} />
      <rect x="196" y="203" width="150" height="4" fill="#9a9893" />
      <rect x="262" y="192" width="54" height="18" rx="8" fill={`url(#${p}-chrome)`} stroke="#8d8a85" strokeWidth="1.5" />
      <path d="M124 204 Q124 191 140 191 H168 Q184 191 184 204" stroke={T} strokeWidth="5" fill="none" />
      {/* cabine */}
      <path
        d="M352 106 Q352 97 362 97 H440 Q451 97 453 108 L459 194 Q461 206 458 214 H425 A31 31 0 0 0 363 214 H352 Z"
        fill={`url(#${p}-body)`}
        stroke={D}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* para-brisa (borda) e janela da porta com o recorte típico do Delivery */}
      <path d="M445 104 L451 158 H443 L437 104 Z" fill={`url(#${p}-glass)`} />
      <path d="M374 108 H431 Q437 108 438 114 L443 156 H420 L410 168 H374 Z" fill={`url(#${p}-glass)`} />
      <path d="M380 112 H414 L394 140 H380 Z" fill="rgba(255,255,255,0.08)" />
      <path d="M368 102 V210 M446 112 L451 196" stroke={SEAM} strokeWidth="2" fill="none" />
      <rect x="378" y="174" width="16" height="4" rx="2" fill={T} />
      <rect x="352" y="181" width="106" height="6" fill={O} />
      {/* faixa preta da grade, farol e para-choque */}
      <path d="M452 146 H460 L461 188 H455 Z" fill={T} />
      <path d="M454 190 H463 L464 202 H456 Z" fill={LENS} stroke={T} strokeWidth="1.5" />
      <path d="M432 206 H461 Q467 208 467 216 V226 Q467 231 461 231 H434 Q437 218 432 206 Z" fill={T} />
      <rect x="344" y="204" width="20" height="5" rx="1" fill={T} />
      <path d="M359 216 A36 36 0 0 1 429 216" stroke={T} strokeWidth="5" fill="none" />
      {/* retrovisor */}
      <path d="M452 112 Q466 110 470 118" stroke={T} strokeWidth="3" fill="none" />
      <rect x="467" y="112" width="8" height="34" rx="3" fill={T} />
      <Wheel p={p} cx={154} cy={217} r={23} rim="chrome" holes={8} />
      <Wheel p={p} cx={394} cy={217} r={23} rim="chrome" holes={8} />
    </svg>
  )
}

export const vehicleById = {
  fiorino: Fiorino,
  strada: Strada,
  carreta: Carreta,
  delivery: Delivery,
  // ônibus: modelo double deck com a pintura da Satélite Norte por padrão
  onibus: (props) => <Coach deck="double" paint="sateliteNorte" {...props} />,
}
