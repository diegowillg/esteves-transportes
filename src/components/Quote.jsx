import { useRef, useState } from 'react'
import { company, whatsappLink } from '../data/site.js'
import SectionHead from './SectionHead.jsx'
import {
  maskCPF,
  maskCNPJ,
  isValidCPF,
  isValidCNPJ,
  maskPhone,
  validatePhone,
  maskEmail,
  validateEmail,
  maskPersonName,
  titleCase,
  collapseSpaces,
  validateName,
  sentenceCase,
  maskWeight,
  normalizeWeight,
  validateWeight,
  maskMoney,
  validateMoney,
  maskInteger,
  digits,
} from '../lib/formatters.js'
import CityCombo from './CityCombo.jsx'

const OBS_MAX = 500

const empty = {
  tipo: 'Pessoa física',
  nome: '',
  documento: '',
  contato: 'WhatsApp',
  whatsapp: '',
  email: '',
  origemUF: '',
  origemCidade: '',
  destinoUF: '',
  destinoCidade: '',
  mercadoria: '',
  volumes: '',
  peso: '',
  valor: '',
  observacoes: '',
  _honey: '',
}

// Ordem dos campos (usada para focar o primeiro com erro)
const ORDER = ['nome', 'documento', 'whatsapp', 'email', 'origemCidade', 'destinoCidade', 'mercadoria', 'peso', 'valor', 'volumes']

// Formatação aplicada enquanto a pessoa digita
function liveMask(name, value, f) {
  switch (name) {
    case 'nome':
      return f.tipo === 'Empresa' ? value.replace(/\s{2,}/g, ' ') : maskPersonName(value)
    case 'documento':
      return f.tipo === 'Empresa' ? maskCNPJ(value) : maskCPF(value)
    case 'whatsapp':
      return maskPhone(value)
    case 'email':
      return maskEmail(value)
    case 'peso':
      return maskWeight(value)
    case 'valor':
      return maskMoney(value)
    case 'volumes':
      return maskInteger(value)
    case 'observacoes':
      return value.slice(0, OBS_MAX)
    case 'origemCidade':
    case 'destinoCidade':
      return value.replace(/[^\p{L}\s'-]/gu, '').replace(/\s{2,}/g, ' ')
    default:
      return value
  }
}

// Padronização aplicada ao sair do campo e no envio
function normalize(name, value, f) {
  switch (name) {
    case 'nome':
      // razão social mantém a grafia digitada (LTDA, ME, siglas); nome de pessoa ganha maiúsculas certas
      return f.tipo === 'Empresa' ? collapseSpaces(value) : titleCase(value)
    case 'mercadoria':
      return sentenceCase(value)
    case 'peso':
      return normalizeWeight(value)
    case 'observacoes':
      return value.trim()
    default:
      return typeof value === 'string' ? value.trim() : value
  }
}

function validate(name, value, f) {
  switch (name) {
    case 'nome':
      return validateName(value, f.tipo === 'Empresa')
    case 'documento': {
      if (!value) return ''
      if (f.tipo === 'Empresa') {
        if (digits(value).length < 14) return 'CNPJ incompleto.'
        return isValidCNPJ(value) ? '' : 'CNPJ inválido.'
      }
      if (digits(value).length < 11) return 'CPF incompleto.'
      return isValidCPF(value) ? '' : 'CPF inválido.'
    }
    case 'whatsapp':
      return validatePhone(value, f.contato === 'WhatsApp')
    case 'email':
      return validateEmail(value, f.contato === 'E-mail')
    case 'origemCidade':
    case 'destinoCidade': {
      if (!collapseSpaces(value)) return 'Informe a cidade.'
      const uf = name === 'origemCidade' ? f.origemUF : f.destinoUF
      return uf ? '' : 'Escolha a cidade na lista.'
    }
    case 'mercadoria':
      return collapseSpaces(value).length < 3 ? 'Descreva a mercadoria.' : ''
    case 'peso':
      return validateWeight(value)
    case 'valor':
      return validateMoney(value)
    default:
      return ''
  }
}

function Segmented({ name, value, options, onChange }) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((o) => (
        <label key={o} className={value === o ? 'is-on' : ''}>
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
          {o}
        </label>
      ))}
    </div>
  )
}

function FieldError({ id, msg }) {
  if (!msg) return null
  return (
    <small className="field-error" id={id} role="alert">
      {msg}
    </small>
  )
}

export default function Quote() {
  const [f, setF] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const formRef = useRef(null)

  const empresa = f.tipo === 'Empresa'

  // props comuns de cada campo: máscara ao digitar, padronização e validação ao sair
  function bind(name) {
    return {
      name,
      value: f[name],
      'aria-invalid': errors[name] ? 'true' : undefined,
      'aria-describedby': errors[name] ? `err-${name}` : undefined,
      onChange: (e) => {
        const value = liveMask(name, e.target.value, f)
        setF((prev) => ({ ...prev, [name]: value }))
        // corrige o erro assim que o campo fica válido
        if (errors[name] && !validate(name, value, f)) setErrors((prev) => ({ ...prev, [name]: '' }))
      },
      onBlur: (e) => {
        const value = normalize(name, e.target.value, f)
        setF((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: validate(name, value, f) }))
      },
    }
  }

  function summary(data = f) {
    return [
      `Tipo de cliente: ${data.tipo}`,
      `${data.tipo === 'Empresa' ? 'Razão social' : 'Nome'}: ${data.nome}`,
      `${data.tipo === 'Empresa' ? 'CNPJ' : 'CPF'}: ${data.documento || '-'}`,
      `Prefere retorno por: ${data.contato}`,
      `WhatsApp: ${data.whatsapp || '-'}`,
      `E-mail: ${data.email || '-'}`,
      `Cidade de origem: ${data.origemCidade} / ${data.origemUF}`,
      `Cidade de destino: ${data.destinoCidade} / ${data.destinoUF}`,
      `Mercadoria: ${data.mercadoria}`,
      `Volumes: ${data.volumes || '-'}`,
      `Peso: ${data.peso} kg`,
      `Valor da nota: R$ ${data.valor}`,
      `Observações: ${data.observacoes || '-'}`,
    ].join('\n')
  }

  async function submit(e) {
    e.preventDefault()
    if (f._honey) return

    // padroniza e valida tudo antes de enviar
    const data = { ...f }
    for (const k of ORDER.concat('observacoes')) data[k] = normalize(k, data[k], data)
    const errs = {}
    for (const k of ORDER) errs[k] = validate(k, data[k], data)
    setF(data)
    setErrors(errs)
    const first = ORDER.find((k) => errs[k])
    if (first) {
      const el = formRef.current?.querySelector(`[name="${first}"]`)
      el?.focus()
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${company.quoteEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Cotação de frete: ${data.nome} (${data.origemCidade}/${data.origemUF} → ${data.destinoCidade}/${data.destinoUF})`,
          _template: 'table',
          _captcha: 'false',
          ...(data.email && { _replyto: data.email }),
          'Tipo de cliente': data.tipo,
          [data.tipo === 'Empresa' ? 'Razão social' : 'Nome']: data.nome,
          [data.tipo === 'Empresa' ? 'CNPJ' : 'CPF']: data.documento || '-',
          'Prefere retorno por': data.contato,
          WhatsApp: data.whatsapp || '-',
          'E-mail': data.email || '-',
          'Cidade de origem': `${data.origemCidade} / ${data.origemUF}`,
          'Cidade de destino': `${data.destinoCidade} / ${data.destinoUF}`,
          Mercadoria: data.mercadoria,
          Volumes: data.volumes || '-',
          'Peso (kg)': data.peso,
          'Valor da nota (R$)': data.valor,
          Observações: data.observacoes || '-',
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'Falha no envio')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const mailtoFallback = `mailto:${company.quoteEmail}?subject=${encodeURIComponent(
    `Cotação de frete: ${f.nome}`
  )}&body=${encodeURIComponent(summary())}`

  const errorCount = Object.values(errors).filter(Boolean).length

  // props do campo de cidade (busca em todos os municípios)
  function cityProps(prefix) {
    const cityName = `${prefix}Cidade`
    const ufName = `${prefix}UF`
    const clearErr = () => setErrors((prev) => ({ ...prev, [cityName]: '' }))
    return {
      name: cityName,
      value: { city: f[cityName], uf: f[ufName] },
      error: errors[cityName],
      onType: (text) => {
        setF((prev) => ({ ...prev, [cityName]: text, [ufName]: '' }))
        if (!text) clearErr()
      },
      onSelect: (city, uf) => {
        setF((prev) => ({ ...prev, [cityName]: city, [ufName]: uf }))
        clearErr()
      },
      onResolve: (text, problem) => {
        if (!problem) return
        setErrors((prev) => ({
          ...prev,
          [cityName]: problem === 'ambiguous' ? 'Há mais de uma. Escolha na lista.' : 'Cidade não encontrada.',
        }))
      },
    }
  }

  return (
    <section className="section section--bone" id="cotacao">
      <div className="container quote-grid">
        <div className="quote-aside">
          <SectionHead km="05" eyebrow="Cotação de frete" title="Quanto custa enviar sua mercadoria?">
            Preencha os dados abaixo. Sua cotação chega para a nossa equipe e um atendente retorna com
            preço e prazo pelo canal que você escolher.
          </SectionHead>
          <ol className="quote-steps">
            <li>
              <span>1</span>Você envia o formulário
            </li>
            <li>
              <span>2</span>A cotação chega por e-mail para a equipe
            </li>
            <li>
              <span>3</span>Retornamos pelo WhatsApp ou e-mail
            </li>
          </ol>
        </div>

        {status === 'sent' ? (
          <div className="quote-form quote-done" role="status">
            <div className="quote-done-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M8 16.5l5.5 5.5L24 11" />
              </svg>
            </div>
            <h3>Cotação enviada!</h3>
            <p>
              Recebemos seus dados. Um atendente vai responder pelo{' '}
              <strong>{f.contato === 'WhatsApp' ? `WhatsApp ${f.whatsapp}` : `e-mail ${f.email}`}</strong> em
              horário comercial.
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setF(empty)
                setErrors({})
                setStatus('idle')
              }}
            >
              Fazer outra cotação
            </button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submit} noValidate ref={formRef}>
            <fieldset>
              <legend>
                <span>01</span> Seus dados
              </legend>
              <div className="field span-2">
                <span className="field-label">Você é</span>
                <Segmented
                  name="tipo"
                  value={f.tipo}
                  options={['Pessoa física', 'Empresa']}
                  onChange={(tipo) => {
                    setF({ ...f, tipo, documento: '' })
                    setErrors((prev) => ({ ...prev, documento: '', nome: '' }))
                  }}
                />
              </div>
              <label>
                <span>{empresa ? 'Razão social *' : 'Nome completo *'}</span>
                <input
                  autoComplete={empresa ? 'organization' : 'name'}
                  autoCapitalize="words"
                  maxLength={120}
                  {...bind('nome')}
                />
                <FieldError id="err-nome" msg={errors.nome} />
              </label>
              <label>
                <span>{empresa ? 'CNPJ' : 'CPF'}</span>
                <input inputMode="numeric" placeholder={empresa ? '00.000.000/0000-00' : '000.000.000-00'} {...bind('documento')} />
                <FieldError id="err-documento" msg={errors.documento} />
              </label>
            </fieldset>

            <fieldset>
              <legend>
                <span>02</span> Como prefere receber a resposta?
              </legend>
              <div className="field span-2">
                <Segmented
                  name="contato"
                  value={f.contato}
                  options={['WhatsApp', 'E-mail']}
                  onChange={(contato) => {
                    setF({ ...f, contato })
                    setErrors((prev) => ({ ...prev, whatsapp: '', email: '' }))
                  }}
                />
              </div>
              <label>
                <span>WhatsApp{f.contato === 'WhatsApp' ? ' *' : ''}</span>
                <input type="tel" autoComplete="tel-national" inputMode="numeric" placeholder="(00)00000-0000" {...bind('whatsapp')} />
                <FieldError id="err-whatsapp" msg={errors.whatsapp} />
              </label>
              <label>
                <span>E-mail{f.contato === 'E-mail' ? ' *' : ''}</span>
                <input type="email" autoComplete="email" autoCapitalize="none" placeholder="voce@email.com" maxLength={120} {...bind('email')} />
                <FieldError id="err-email" msg={errors.email} />
              </label>
            </fieldset>

            <fieldset>
              <legend>
                <span>03</span> Sobre a carga
              </legend>
              <CityCombo label="Cidade de origem *" {...cityProps('origem')} />
              <CityCombo label="Cidade de destino *" {...cityProps('destino')} />
              <label className="span-2">
                <span>Mercadoria *</span>
                <input
                  placeholder="Ex.: peças automotivas, caixas de roupas, eletrodoméstico..."
                  autoCapitalize="sentences"
                  maxLength={150}
                  {...bind('mercadoria')}
                />
                <FieldError id="err-mercadoria" msg={errors.mercadoria} />
              </label>
              <div className="trio span-2">
                <label>
                  <span>Peso total *</span>
                  <div className="affix">
                    <input inputMode="decimal" placeholder="0" {...bind('peso')} />
                    <i>kg</i>
                  </div>
                  <FieldError id="err-peso" msg={errors.peso} />
                </label>
                <label>
                  <span>Valor da nota *</span>
                  <div className="affix affix--pre">
                    <i>R$</i>
                    <input inputMode="numeric" placeholder="0,00" {...bind('valor')} />
                  </div>
                  <FieldError id="err-valor" msg={errors.valor} />
                </label>
                <label>
                  <span>Volumes</span>
                  <input inputMode="numeric" placeholder="Qtd." {...bind('volumes')} />
                </label>
              </div>
              <label className="span-2">
                <span className="label-row">
                  Observações
                  <em className="char-count">
                    {f.observacoes.length}/{OBS_MAX}
                  </em>
                </span>
                <textarea rows="3" placeholder="Medidas, se precisa de coleta, urgência..." {...bind('observacoes')} />
              </label>
            </fieldset>

            <input type="text" name="_honey" className="hp" tabIndex="-1" autoComplete="off" value={f._honey} onChange={(e) => setF({ ...f, _honey: e.target.value })} aria-hidden="true" />

            {status === 'error' && (
              <div className="quote-error" role="alert">
                Não foi possível enviar agora.{' '}
                <a href={mailtoFallback}>Enviar pelo seu e-mail</a> ou{' '}
                <a href={whatsappLink(`Olá! Gostaria de uma cotação de frete.\n\n${summary()}`)} target="_blank" rel="noopener noreferrer">
                  mandar pelo WhatsApp
                </a>
                .
              </div>
            )}

            <button type="submit" className="btn btn--primary quote-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar pedido de cotação'}
            </button>
            {/* a mesma linha mostra o aviso de erros: nada é empurrado para baixo */}
            <small className={`quote-note${errorCount ? ' quote-note--error' : ''}`} role={errorCount ? 'alert' : undefined}>
              {errorCount
                ? `Corrija ${errorCount === 1 ? 'o campo marcado' : `os ${errorCount} campos marcados`} em vermelho.`
                : 'Seus dados são usados apenas para responder esta cotação.'}
            </small>
          </form>
        )}
      </div>
    </section>
  )
}
