import { useEffect, useState } from 'react'
import { bases, commissioned, stats, whatsappLink, modes, partnerByCode } from '../data/site.js'
import { Carreta, Fiorino, Strada } from './Vehicles.jsx'
import { Coach } from './Coach.jsx'
import { useWhatsApp } from './ContactPicker.jsx'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <time>{now.toLocaleTimeString('pt-BR')}</time>
}

function Board() {
  const rows = bases.flatMap((b) => b.partners.map((p) => ({ ...p, base: b.id, kind: b.kind })))
  return (
    <div className="board" aria-label="Painel de operação das bases">
      <div className="board-head">
        <span>
          <i className="live-dot" aria-hidden="true" /> Painel de operação
        </span>
        <Clock />
      </div>
      <table>
        <thead>
          <tr>
            <th>Cód.</th>
            <th>Transportadora</th>
            <th>Base</th>
            <th>Modal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="mono">{r.code}</td>
              <td>{r.subtitle ? `${r.name} ${r.subtitle}` : r.name}</td>
              <td className="mono">
                {r.base} <span className="board-city">{r.kind}</span>
              </td>
              <td>
                <span className={`status${r.own ? ' status--own' : ''}`}>{modes[r.mode].short}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="board-foot">
        {bases.map((b) => (
          <span key={b.id}>
            {b.kind}: <strong>{b.partners.length} transportadoras</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const wa = useWhatsApp()
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Transporte de cargas e encomendas</p>
          <h1>
            Sua mercadoria entregue por quem <span className="hl">conhece a região.</span>
          </h1>
          <p className="lead">
            Somos filial de {commissioned} transportadoras e temos rotas próprias, operando em um
            galpão e na rodoviária. Atendemos pessoas físicas e empresas, como distribuidoras de peças,
            comércio e indústria, com ônibus, caminhões e utilitários.
          </p>
          <div className="hero-actions">
            <a href="#cotacao" className="btn btn--primary">
              Cotar frete
              <Arrow />
            </a>
            <a {...wa('Olá! Preciso falar com um atendente.', whatsappLink())} className="btn btn--ghost">
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <Board />
      </div>

      <div className="road" aria-hidden="true">
        <div className="lane lane--top">
          <div className="vehicle v-carreta">
            <Carreta className="moving" brand={false} livery={partnerByCode.PAN.livery} />
          </div>
          <div className="vehicle v-fiorino">
            <Fiorino className="moving" />
          </div>
        </div>
        <div className="lane lane--bottom">
          <div className="vehicle v-onibus">
            <Coach className="moving" {...partnerByCode.SAT.coach} />
          </div>
          <div className="vehicle v-strada">
            <Strada className="moving" />
          </div>
          <div className="vehicle v-onibus v-onibus-2">
            <Coach className="moving" {...partnerByCode.EST.coach} />
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="arrow" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  )
}
