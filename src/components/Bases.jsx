import { bases, commissioned, modes } from '../data/site.js'
import SectionHead from './SectionHead.jsx'
import { vehicleById } from './Vehicles.jsx'
import { Coach } from './Coach.jsx'

function BaseIcon({ kind }) {
  // galpão: telhado em duas águas | rodoviária: cobertura de plataforma
  return kind === 'Rodoviária' ? (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 16h40M8 16l4-8h24l4 8" />
      <path d="M10 16v24M38 16v24M24 16v24" />
      <path d="M4 40h40" />
    </svg>
  ) : (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 20 24 8l20 12v20H4z" />
      <path d="M14 40V26h20v14M14 31h20M14 36h20" />
    </svg>
  )
}

function Partner({ p }) {
  const Vehicle = vehicleById[modes[p.mode].vehicle]
  return (
    <li className={`carrier${p.own ? ' carrier--own' : ''}`}>
      <div className="carrier-visual">
        {p.coach ? (
          <Coach className="carrier-svg" {...p.coach} />
        ) : (
          <Vehicle className="carrier-svg" brand={p.own} livery={p.livery} />
        )}
      </div>
      <div className="carrier-body">
        <div className="carrier-tags">
          <span className="tag tag--mode">{modes[p.mode].short}</span>
          {p.own && <span className="tag tag--own">Própria</span>}
        </div>
        <div className="carrier-logo-box">
          <img className="carrier-logo" src={p.logo} alt={p.subtitle ? `${p.name} ${p.subtitle}` : p.name} />
        </div>
        <span className="carrier-scope">{p.scope}</span>
      </div>
    </li>
  )
}

function BaseCard({ base }) {
  return (
    <article className="base">
      <header className="base-head">
        <div className="base-num">{base.id}</div>
        <div>
          <p className="base-kicker">
            Base {base.id} · {base.kind}
          </p>
          <h3>
            {base.city} <span>/ {base.uf}</span>
          </h3>
          <p className="base-addr">
            {base.address}
            {base.cep && (
              <>
                {' · '}
                <span className="nowrap">CEP {base.cep}</span>
              </>
            )}
          </p>
        </div>
        <div className="base-icon">
          <BaseIcon kind={base.kind} />
        </div>
      </header>

      <p className="base-summary">{base.summary}</p>

      <dl className="base-hours">
        <div>
          <dt>Atendimento</dt>
          <dd>{base.hours}</dd>
        </div>
        <div>
          <dt>Intervalo</dt>
          <dd>{base.break.replace('Intervalo das ', '')}</dd>
        </div>
        <div>
          <dt>Como chegar</dt>
          <dd>
            <a href={base.maps} target="_blank" rel="noopener noreferrer">
              Abrir no mapa ↗
            </a>
          </dd>
        </div>
      </dl>

      <ul className="carriers">
        {base.partners.map((p) => (
          <Partner key={p.code} p={p} />
        ))}
      </ul>

      <footer className="base-foot">
        <span>
          {base.partners.length} transportadoras atendidas
        </span>
        <a href={`tel:${base.phone.replace(/\D/g, '')}`}>{base.phone}</a>
      </footer>
    </article>
  )
}

export default function Bases() {
  return (
    <section className="section section--bone" id="bases">
      <div className="container">
        <SectionHead km="02" eyebrow="Nossas bases" title="Um galpão e uma base na rodoviária.">
          A Esteves Transportes é filial de {commissioned} transportadoras e também opera rotas
          próprias. No galpão saem as cargas de caminhão e utilitário; na rodoviária, as encomendas que seguem
          de ônibus.
        </SectionHead>

        <div className="bases-grid">
          {bases.map((b) => (
            <BaseCard key={b.id} base={b} />
          ))}
        </div>
      </div>
    </section>
  )
}
