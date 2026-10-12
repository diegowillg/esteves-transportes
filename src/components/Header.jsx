import { useState } from 'react'
import { company } from '../data/site.js'
import logo from '../assets/logo-esteves-h.png'
import logoWhite from '../assets/logo-esteves-h-white.png'

export function Logo({ light = false }) {
  return (
    <a href="#topo" className="logo" aria-label="Esteves Transportes, início">
      <img src={light ? logoWhite : logo} alt="Esteves Transportes" width="1112" height="200" />
    </a>
  )
}

const links = [
  ['#como-funciona', 'Como funciona'],
  ['#bases', 'Bases'],
  ['#frota', 'Frota'],
  ['#servicos', 'Serviços'],
  ['#localizar', 'Localizar carga'],
  ['#faq', 'Dúvidas'],
]

// links secundários: na faixa do topo (computador) e no menu (celular)
const extraLinks = [
  ['#parceria', 'Seja nossa filial'],
  ['#trabalhe-conosco', 'Trabalhe conosco'],
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="utility" id="topo">
        <div className="container utility-inner">
          <span>{company.hours}</span>
          <span className="utility-links">
            {extraLinks.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </span>
          <span className="utility-contacts">
            <a href={`tel:${company.phone.replace(/\D/g, '')}`}>{company.phone}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </span>
        </div>
      </div>
      <nav className="nav" aria-label="Principal">
        <div className="container nav-inner">
          <Logo />
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="burger" data-open={open} />
          </button>
          <div id="nav-links" className="nav-links" data-open={open}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            {extraLinks.map(([href, label]) => (
              <a key={href} href={href} className="nav-extra" onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a href="#cotacao" className="btn btn--primary btn--sm" onClick={() => setOpen(false)}>
              Cotar frete
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
