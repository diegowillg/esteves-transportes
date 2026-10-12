import { company, whatsappLink } from '../data/site.js'
import { Fiorino } from './Vehicles.jsx'
import { useWhatsApp } from './ContactPicker.jsx'

export default function Locate() {
  const wa = useWhatsApp()
  return (
    <section className="tracking" id="localizar">
      <div className="container tracking-grid">
        <div>
          <div className="km km--inverse" aria-hidden="true">
            <span>KM</span>
            <strong>06</strong>
          </div>
          <h2>Onde está a minha mercadoria?</h2>
          <p>
            A localização da sua carga é feita por um atendente. Chame no WhatsApp e informamos em qual
            base ou rota ela está e a previsão de entrega.
          </p>
          <Fiorino className="tracking-van" />
        </div>

        <div className="locate-card">
          <strong className="locate-title">Tenha em mãos um destes dados:</strong>
          <ul className="locate-list">
            <li>
              <span>01</span>Número da nota fiscal
            </li>
            <li>
              <span>02</span>Nome ou CPF/CNPJ do remetente
            </li>
            <li>
              <span>03</span>Cidade de origem e de destino
            </li>
          </ul>
          <a
            className="btn btn--whats"
            {...wa('Olá! Gostaria de localizar uma mercadoria.', whatsappLink())}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6a10.6 10.6 0 01-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1116 26.6z"
              />
            </svg>
            Falar com um atendente
          </a>
          <small>
            Escolha a empresa responsável pela sua carga · {company.hours}
          </small>
        </div>
      </div>
    </section>
  )
}
