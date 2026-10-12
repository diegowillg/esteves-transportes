import { services } from '../data/site.js'
import SectionHead from './SectionHead.jsx'

export default function Services() {
  return (
    <section className="section" id="servicos">
      <div className="container">
        <SectionHead km="04" eyebrow="Serviços" title="O que fazemos pela sua carga dentro da região." />
        <div className="services">
          {services.map((s, i) => (
            <article className="service" key={s.title}>
              <span className="service-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
