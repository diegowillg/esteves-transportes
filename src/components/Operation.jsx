import { steps, audiences } from '../data/site.js'
import SectionHead from './SectionHead.jsx'

const icons = {
  dock: (
    <>
      <path d="M4 20V9l12-5 12 5v11" />
      <path d="M9 20v-7h14v7" />
      <path d="M9 16.5h14" />
    </>
  ),
  check: (
    <>
      <rect x="7" y="4" width="18" height="22" rx="1" />
      <path d="M11 4v3h10V4" />
      <path d="M11 15l3 3 7-7" />
    </>
  ),
  chat: (
    <>
      <path d="M5 7a2 2 0 012-2h18a2 2 0 012 2v12a2 2 0 01-2 2H13l-6 5v-5H7a2 2 0 01-2-2z" />
      <path d="M11 13h10M11 9.5h6" />
    </>
  ),
  pin: (
    <>
      <path d="M16 28s-8-8.5-8-14a8 8 0 0116 0c0 5.5-8 14-8 14z" />
      <path d="M12.5 14l2.5 2.5 4.5-4.5" />
    </>
  ),
}

export default function Operation() {
  return (
    <section className="section" id="como-funciona">
      <div className="container">
        <SectionHead km="01" eyebrow="Como funciona" title="Do pedido de cotação à entrega, sem complicação.">
          Você conta o que precisa enviar, um atendente responde com preço e prazo e a gente cuida do
          resto, da coleta até o destino.
        </SectionHead>

        <div className="flow">
          <div className="flow-road" aria-hidden="true" />
          <ol className="flow-steps">
            {steps.map((s) => (
              <li key={s.n} className="flow-step">
                <div className="flow-icon">
                  <svg viewBox="0 0 32 32" aria-hidden="true">
                    {icons[s.icon]}
                  </svg>
                </div>
                <span className="flow-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="audience">
          <h3 className="audience-title">Para quem transportamos</h3>
          <div className="audience-grid">
            {audiences.map((a, i) => (
              <div key={a.title} className={`audience-card${i === 1 ? ' audience-card--accent' : ''}`}>
                <span className="audience-tag">{a.tag}</span>
                <strong>{a.title}</strong>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
