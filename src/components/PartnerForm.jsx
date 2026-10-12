import { useRef, useState } from 'react'
import { company, bases } from '../data/site.js'
import SectionHead from './SectionHead.jsx'
import Segmented from './Segmented.jsx'
import CityCombo from './CityCombo.jsx'
import { useForm, FieldError, focusField } from '../lib/useForm.jsx'
import { sendForm } from '../lib/sendForm.js'
import {
  maskCNPJ,
  isValidCNPJ,
  maskPhone,
  validatePhone,
  maskEmail,
  validateEmail,
  maskPersonName,
  titleCase,
  collapseSpaces,
  validateName,
  digits,
} from '../lib/formatters.js'

const MODAIS = ['Caminhão', 'Ônibus', 'Utilitário', 'Outro']
const VOLUMES = ['Até 100 volumes por mês', '100 a 500 volumes', '500 a 2.000 volumes', 'Mais de 2.000 volumes']
const MSG_MAX = 600

const initial = {
  empresa: '',
  cnpj: '',
  responsavel: '',
  whatsapp: '',
  email: '',
  cidade: '',
  uf: '',
  modais: [],
  volume: '',
  base: 'A definir',
  mensagem: '',
  _honey: '',
}

const rules = {
  empresa: {
    mask: (v) => v.replace(/\s{2,}/g, ' '),
    normalize: (v) => collapseSpaces(v),
    validate: (v) => validateName(v, true),
  },
  cnpj: {
    mask: maskCNPJ,
    validate: (v) => {
      if (!v) return 'Informe o CNPJ.'
      if (digits(v).length < 14) return 'CNPJ incompleto.'
      return isValidCNPJ(v) ? '' : 'CNPJ inválido.'
    },
  },
  responsavel: {
    mask: maskPersonName,
    normalize: titleCase,
    validate: (v) => validateName(v, false),
  },
  whatsapp: { mask: maskPhone, validate: (v) => validatePhone(v, true) },
  email: { mask: maskEmail, validate: (v) => validateEmail(v, true) },
  cidade: {
    validate: (v, all) => (!collapseSpaces(v) ? 'Informe a cidade da sede.' : all.uf ? '' : 'Escolha a cidade na lista.'),
  },
  modais: { validate: (v) => (v.length ? '' : 'Marque ao menos um.') },
  volume: { validate: (v) => (v ? '' : 'Escolha uma faixa.') },
  mensagem: { mask: (v) => v.slice(0, MSG_MAX), normalize: (v) => v.trim() },
}

export default function PartnerForm() {
  const form = useForm(initial, rules)
  const { values: f, errors, bind, setField, setError } = form
  const [status, setStatus] = useState('idle')
  const formRef = useRef(null)
  const partners = bases.flatMap((b) => b.partners.filter((p) => !p.own))

  async function submit(e) {
    e.preventDefault()
    if (f._honey) return
    const { data, first } = form.validateAll()
    if (first) return focusField(formRef.current, first)
    setStatus('sending')
    try {
      await sendForm({
        to: company.partnersEmail,
        subject: `Proposta de filial: ${data.empresa}`,
        replyTo: data.email,
        fields: {
          Transportadora: data.empresa,
          CNPJ: data.cnpj,
          Responsável: data.responsavel,
          WhatsApp: data.whatsapp,
          'E-mail': data.email,
          'Cidade da sede': `${data.cidade} / ${data.uf}`,
          Modais: data.modais.join(', '),
          'Volume mensal': data.volume,
          'Base de interesse': data.base,
          Mensagem: data.mensagem || '-',
        },
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <section className="section section--dark" id="parceria">
      <div className="container quote-grid">
        <div className="quote-aside partner-aside">
          <SectionHead km="07" eyebrow="Para transportadoras" title="Tenha uma filial em Uberaba." light>
            A Esteves pode ser a sua <strong>filial comissionada</strong> (também chamada de agência ou
            representante): recebemos, conferimos e despachamos as cargas da sua transportadora na região, e
            você paga uma comissão sobre o que atendemos. Sem abrir unidade própria.
          </SectionHead>
          <ol className="quote-steps quote-steps--dark">
            <li>
              <span>1</span>Você envia a proposta
            </li>
            <li>
              <span>2</span>Avaliamos rotas, volume e base ideal
            </li>
            <li>
              <span>3</span>Combinamos a comissão e começamos a operar
            </li>
          </ol>
          <div className="partner-refs">
            <span>Já somos filial de</span>
            <div>
              {partners.map((p) => (
                <img key={p.code} src={p.logo} alt={p.name} />
              ))}
            </div>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="quote-form quote-done" role="status">
            <div className="quote-done-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M8 16.5l5.5 5.5L24 11" />
              </svg>
            </div>
            <h3>Proposta enviada!</h3>
            <p>Nossa equipe comercial vai analisar e entrar em contato pelo WhatsApp {f.whatsapp} ou pelo e-mail {f.email}.</p>
            <button type="button" className="btn btn--ghost" onClick={() => (form.reset(), setStatus('idle'))}>
              Enviar outra proposta
            </button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submit} noValidate ref={formRef}>
            <fieldset>
              <legend>
                <span>01</span> A transportadora
              </legend>
              <label className="span-2">
                <span>Razão social *</span>
                <input autoComplete="organization" maxLength={120} {...bind('empresa')} />
                <FieldError id="err-empresa" msg={errors.empresa} />
              </label>
              <label>
                <span>CNPJ *</span>
                <input inputMode="numeric" placeholder="00.000.000/0000-00" {...bind('cnpj')} />
                <FieldError id="err-cnpj" msg={errors.cnpj} />
              </label>
              <CityCombo
                label="Cidade da sede *"
                name="cidade"
                value={{ city: f.cidade, uf: f.uf }}
                error={errors.cidade}
                onType={(t) => (setField('cidade', t), setField('uf', ''), !t && setError('cidade', ''))}
                onSelect={(c, uf) => (setField('cidade', c), setField('uf', uf), setError('cidade', ''))}
                onResolve={(t, problem) =>
                  problem && setError('cidade', problem === 'ambiguous' ? 'Há mais de uma. Escolha na lista.' : 'Cidade não encontrada.')
                }
              />
            </fieldset>

            <fieldset>
              <legend>
                <span>02</span> Responsável
              </legend>
              <label className="span-2">
                <span>Nome *</span>
                <input autoComplete="name" maxLength={100} {...bind('responsavel')} />
                <FieldError id="err-responsavel" msg={errors.responsavel} />
              </label>
              <label>
                <span>WhatsApp *</span>
                <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(00)00000-0000" {...bind('whatsapp')} />
                <FieldError id="err-whatsapp" msg={errors.whatsapp} />
              </label>
              <label>
                <span>E-mail *</span>
                <input type="email" autoComplete="email" autoCapitalize="none" placeholder="nome@empresa.com.br" maxLength={120} {...bind('email')} />
                <FieldError id="err-email" msg={errors.email} />
              </label>
            </fieldset>

            <fieldset>
              <legend>
                <span>03</span> A operação
              </legend>
              <div className="field span-2 check-field">
                <span className="field-label">Como suas cargas viajam? *</span>
                <div className="check-group" role="group" aria-label="Modais">
                  {MODAIS.map((m) => (
                    <label key={m} className={`check${f.modais.includes(m) ? ' is-on' : ''}`}>
                      <input
                        type="checkbox"
                        name="modais"
                        checked={f.modais.includes(m)}
                        onChange={() => {
                          const next = f.modais.includes(m) ? f.modais.filter((x) => x !== m) : [...f.modais, m]
                          setField('modais', next)
                          if (next.length) setError('modais', '')
                        }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <FieldError id="err-modais" msg={errors.modais} />
              </div>
              <label>
                <span>Volume mensal *</span>
                <select {...bind('volume')} onChange={(e) => (setField('volume', e.target.value), setError('volume', ''))}>
                  <option value="">Selecione</option>
                  {VOLUMES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <FieldError id="err-volume" msg={errors.volume} />
              </label>
              <div className="field">
                <span className="field-label">Base de interesse</span>
                <Segmented
                  name="base"
                  value={f.base}
                  options={['Galpão', 'Rodoviária', 'A definir']}
                  onChange={(v) => setField('base', v)}
                />
              </div>
              <label className="span-2">
                <span className="label-row">
                  Mensagem
                  <em className="char-count">
                    {f.mensagem.length}/{MSG_MAX}
                  </em>
                </span>
                <textarea rows="3" placeholder="Rotas, cidades atendidas, tipo de carga..." {...bind('mensagem')} />
              </label>
            </fieldset>

            <input type="text" name="_honey" className="hp" tabIndex="-1" autoComplete="off" value={f._honey} onChange={(e) => setField('_honey', e.target.value)} aria-hidden="true" />

            {status === 'error' && (
              <div className="quote-error" role="alert">
                Não foi possível enviar agora. Tente de novo ou escreva para{' '}
                <a href={`mailto:${company.partnersEmail}`}>{company.partnersEmail}</a>.
              </div>
            )}

            <button type="submit" className="btn btn--primary quote-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar proposta'}
            </button>
            <small className={`quote-note${errorCount ? ' quote-note--error' : ''}`} role={errorCount ? 'alert' : undefined}>
              {errorCount
                ? `Corrija ${errorCount === 1 ? 'o campo marcado' : `os ${errorCount} campos marcados`} em vermelho.`
                : 'Respondemos em até 3 dias úteis.'}
            </small>
          </form>
        )}
      </div>
    </section>
  )
}
