import { bases, company, developer, whatsappLink } from '../data/site.js'
import { Logo } from './Header.jsx'
import { useWhatsApp } from './ContactPicker.jsx'

export default function Footer() {
  const wa = useWhatsApp()
  return (
    <footer className="footer">
      <div className="footer-stripe" aria-hidden="true" />
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-about">
            Transporte de cargas e encomendas para pessoas físicas e empresas, com ônibus, caminhões e
            utilitários. Desde {company.founded}.
          </p>
          <p className="footer-legal">CNPJ {company.cnpj}</p>
        </div>
        {bases.map((b) => (
          <div key={b.id}>
            <h4>Base {b.id} · {b.kind}</h4>
            <p>
              {b.address}
              <br />
              {b.city} / {b.uf}
              {b.cep && ` · CEP ${b.cep}`}
              <br />
              {b.hours} ({b.break.toLowerCase()})
              <br />
              <a href={`tel:${b.phone.replace(/\D/g, '')}`}>{b.phone}</a>
            </p>
          </div>
        ))}
        <div>
          <h4>Contato</h4>
          <p>
            <a href={`tel:${company.phone.replace(/\D/g, '')}`}>{company.phone}</a>
            <br />
            <a {...wa('Olá! Preciso falar com um atendente.', whatsappLink())}>WhatsApp: escolher empresa</a>
            <br />
            <a href="#parceria">Seja nossa filial</a>
            <br />
            <a href="#trabalhe-conosco">Trabalhe conosco</a>
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {company.name}. Todos os direitos reservados.</span>
        <span className="dev-credit">
          Desenvolvido por{' '}
          {developer.url ? (
            <a href={developer.url} target="_blank" rel="noopener noreferrer">
              {developer.name}
            </a>
          ) : (
            <strong>{developer.name}</strong>
          )}
        </span>
      </div>
    </footer>
  )
}
