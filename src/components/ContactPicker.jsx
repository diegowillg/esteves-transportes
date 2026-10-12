import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { contacts, modes, whatsappTo } from '../data/site.js'
import logoMark from '../assets/marca-esteves.png'

const ContactContext = createContext(() => {})

// Retorna props para qualquer link/botão de WhatsApp: abre a janela de escolha
// da empresa. O href continua apontando para o WhatsApp da Esteves como
// alternativa caso o JavaScript não carregue.
export function useWhatsApp() {
  const open = useContext(ContactContext)
  return (message, fallbackHref) => ({
    href: fallbackHref,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (e) => {
      e.preventDefault()
      open(message)
    },
  })
}

export function ContactProvider({ children }) {
  const [message, setMessage] = useState(null)
  const open = useCallback((msg) => setMessage(msg || 'Olá! Preciso falar com um atendente.'), [])
  return (
    <ContactContext.Provider value={open}>
      {children}
      {message && <ContactDialog message={message} onClose={() => setMessage(null)} />}
    </ContactContext.Provider>
  )
}

function ContactDialog({ message, onClose }) {
  const panel = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    lastFocus.current = document.activeElement
    panel.current?.querySelector('a')?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const items = [...panel.current.querySelectorAll('a, button')]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.()
    }
  }, [onClose])

  return (
    <div className="cp-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cp-panel" role="dialog" aria-modal="true" aria-labelledby="cp-title" ref={panel}>
        <div className="cp-head">
          <div>
            <span className="eyebrow">Atendimento pelo WhatsApp</span>
            <h2 id="cp-title">Com qual empresa você quer falar?</h2>
          </div>
          <button type="button" className="cp-close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <ul className="cp-list">
          {contacts.map((c) => (
            <li key={c.code}>
              <a
                className="cp-item"
                href={whatsappTo(c.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(onClose, 0)}
              >
                <span className="cp-logo">
                  <img src={c.own ? logoMark : c.logo} alt="" />
                </span>
                <span className="cp-info">
                  <strong>{c.name}</strong>
                  <small>
                    {c.base} · {modes[c.mode].short}
                  </small>
                </span>
                <span className="cp-go" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path
                      fill="currentColor"
                      d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6a10.6 10.6 0 01-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1116 26.6z"
                    />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="cp-note">Você será direcionado para o WhatsApp da empresa escolhida.</p>
      </div>
    </div>
  )
}
