import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Operation from './components/Operation.jsx'
import Bases from './components/Bases.jsx'
import Fleet from './components/Fleet.jsx'
import Services from './components/Services.jsx'
import Locate from './components/Locate.jsx'
import Quote from './components/Quote.jsx'
import Faq from './components/Faq.jsx'
import PartnerForm from './components/PartnerForm.jsx'
import Careers from './components/Careers.jsx'
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx'
import { whatsappLink } from './data/site.js'
import { useWhatsApp } from './components/ContactPicker.jsx'

export default function App() {
  const wa = useWhatsApp()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Operation />
        <Bases />
        <Fleet />
        <Services />
        <Quote />
        <Locate />
        <PartnerForm />
        <Careers />
        <Faq />
      </main>
      <Footer />
      <BackToTop />
      <a
        className="wa-float"
        {...wa('Olá! Preciso falar com um atendente.', whatsappLink('Olá! Preciso falar com um atendente.'))}
        aria-label="Falar pelo WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6a10.6 10.6 0 01-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1116 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 01-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.7 6.3 6.3 0 001.3 3.3 14.4 14.4 0 005.5 4.9c2 .9 2.8.9 3.9.8a3.3 3.3 0 002.1-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.3-.6-.4z"
          />
        </svg>
      </a>
    </>
  )
}
