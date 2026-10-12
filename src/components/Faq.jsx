import { faq } from '../data/site.js'
import SectionHead from './SectionHead.jsx'

export default function Faq() {
  return (
    <section className="section section--bone" id="faq">
      <div className="container faq-grid">
        <SectionHead km="09" eyebrow="Dúvidas frequentes" title="Perguntas frequentes." />
        <div className="faq">
          {faq.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>
                <span>{item.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
