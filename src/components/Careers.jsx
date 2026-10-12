import { useRef, useState } from 'react'
import { company } from '../data/site.js'
import SectionHead from './SectionHead.jsx'
import CityCombo from './CityCombo.jsx'
import { useForm, FieldError, focusField } from '../lib/useForm.jsx'
import { sendForm } from '../lib/sendForm.js'
import {
  maskPhone,
  validatePhone,
  maskEmail,
  validateEmail,
  maskPersonName,
  titleCase,
  collapseSpaces,
  validateName,
} from '../lib/formatters.js'

const AREAS = ['Motorista', 'Ajudante / Carregador', 'Conferente / Estoque', 'Atendimento / Administrativo', 'Outra área']
const CNH = ['Não tenho', 'B', 'C', 'D', 'E']
const EXP_MAX = 800
const FILE_MAX_MB = 5
const FILE_TYPES = ['.pdf', '.doc', '.docx']

const initial = {
  nome: '',
  whatsapp: '',
  email: '',
  cidade: '',
  uf: '',
  area: '',
  cnh: '',
  experiencia: '',
  consentimento: false,
  _honey: '',
}

const rules = {
  nome: { mask: maskPersonName, normalize: titleCase, validate: (v) => validateName(v, false) },
  whatsapp: { mask: maskPhone, validate: (v) => validatePhone(v, true) },
  email: { mask: maskEmail, validate: (v) => validateEmail(v, true) },
  cidade: {
    validate: (v, all) => (!collapseSpaces(v) ? 'Informe sua cidade.' : all.uf ? '' : 'Escolha a cidade na lista.'),
  },
  area: { validate: (v) => (v ? '' : 'Escolha uma área.') },
  cnh: { validate: (v, all) => (all.area === 'Motorista' && !v ? 'Informe sua CNH.' : '') },
  experiencia: { mask: (v) => v.slice(0, EXP_MAX), normalize: (v) => v.trim() },
  consentimento: { validate: (v) => (v ? '' : 'Marque para continuar.') },
}

const formatSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.round(b / 1024)} KB`)

export default function Careers() {
  const form = useForm(initial, rules)
  const { values: f, errors, bind, setField, setError } = form
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [status, setStatus] = useState('idle')
  const formRef = useRef(null)
  const fileRef = useRef(null)

  function pickFile(e) {
    const fl = e.target.files?.[0]
    if (!fl) return
    const ext = fl.name.slice(fl.name.lastIndexOf('.')).toLowerCase()
    if (!FILE_TYPES.includes(ext)) {
      setFileError('Envie em PDF ou Word.')
      e.target.value = ''
      return
    }
    if (fl.size > FILE_MAX_MB * 1024 * 1024) {
      setFileError(`O arquivo passa de ${FILE_MAX_MB} MB.`)
      e.target.value = ''
      return
    }
    setFileError('')
    setFile(fl)
  }

  async function submit(e) {
    e.preventDefault()
    if (f._honey) return
    const { data, first } = form.validateAll()
    if (first) return focusField(formRef.current, first)
    setStatus('sending')
    try {
      await sendForm({
        to: company.careersEmail,
        subject: `Currículo: ${data.nome} (${data.area})`,
        replyTo: data.email,
        file,
        fields: {
          Nome: data.nome,
          WhatsApp: data.whatsapp,
          'E-mail': data.email,
          Cidade: `${data.cidade} / ${data.uf}`,
          'Área de interesse': data.area,
          CNH: data.area === 'Motorista' ? data.cnh : '-',
          Experiência: data.experiencia || '-',
          Currículo: file ? `${file.name} (anexo)` : 'Não enviado',
          'Autorizou uso dos dados (LGPD)': 'Sim',
        },
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <section className="section" id="trabalhe-conosco">
      <div className="container quote-grid">
        <div className="quote-aside">
          <SectionHead km="08" eyebrow="Trabalhe conosco" title="Venha fazer parte da Esteves.">
            Estamos sempre em busca de motoristas, ajudantes, conferentes e pessoas para o atendimento. Deixe seu
            currículo: quando surgir uma vaga no seu perfil, entramos em contato.
          </SectionHead>
          <ul className="career-areas">
            {AREAS.slice(0, 4).map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        {status === 'sent' ? (
          <div className="quote-form quote-done" role="status">
            <div className="quote-done-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M8 16.5l5.5 5.5L24 11" />
              </svg>
            </div>
            <h3>Currículo enviado!</h3>
            <p>Obrigado, {f.nome.split(' ')[0]}. Seu cadastro fica no nosso banco de talentos e falamos com você quando surgir uma vaga.</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                form.reset()
                setFile(null)
                setStatus('idle')
              }}
            >
              Enviar outro currículo
            </button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submit} noValidate ref={formRef}>
            <fieldset>
              <legend>
                <span>01</span> Seus dados
              </legend>
              <label className="span-2">
                <span>Nome completo *</span>
                <input autoComplete="name" autoCapitalize="words" maxLength={100} {...bind('nome')} />
                <FieldError id="err-nome" msg={errors.nome} />
              </label>
              <label>
                <span>WhatsApp *</span>
                <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(00)00000-0000" {...bind('whatsapp')} />
                <FieldError id="err-whatsapp" msg={errors.whatsapp} />
              </label>
              <label>
                <span>E-mail *</span>
                <input type="email" autoComplete="email" autoCapitalize="none" placeholder="voce@email.com" maxLength={120} {...bind('email')} />
                <FieldError id="err-email" msg={errors.email} />
              </label>
              <div className="span-2">
                <CityCombo
                  label="Cidade onde mora *"
                  name="cidade"
                  value={{ city: f.cidade, uf: f.uf }}
                  error={errors.cidade}
                  onType={(t) => (setField('cidade', t), setField('uf', ''), !t && setError('cidade', ''))}
                  onSelect={(c, uf) => (setField('cidade', c), setField('uf', uf), setError('cidade', ''))}
                  onResolve={(t, problem) =>
                    problem && setError('cidade', problem === 'ambiguous' ? 'Há mais de uma. Escolha na lista.' : 'Cidade não encontrada.')
                  }
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>02</span> Vaga de interesse
              </legend>
              <label className={f.area === 'Motorista' ? '' : 'span-2'}>
                <span>Área *</span>
                <select
                  {...bind('area')}
                  onChange={(e) => {
                    setField('area', e.target.value)
                    setError('area', '')
                    if (e.target.value !== 'Motorista') setError('cnh', '')
                  }}
                >
                  <option value="">Selecione</option>
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <FieldError id="err-area" msg={errors.area} />
              </label>
              {f.area === 'Motorista' && (
                <label>
                  <span>Categoria da CNH *</span>
                  <select {...bind('cnh')} onChange={(e) => (setField('cnh', e.target.value), setError('cnh', ''))}>
                    <option value="">Selecione</option>
                    {CNH.map((c) => (
                      <option key={c} value={c}>
                        {c === 'Não tenho' ? c : `Categoria ${c}`}
                      </option>
                    ))}
                  </select>
                  <FieldError id="err-cnh" msg={errors.cnh} />
                </label>
              )}
              <label className="span-2">
                <span className="label-row">
                  Experiência
                  <em className="char-count">
                    {f.experiencia.length}/{EXP_MAX}
                  </em>
                </span>
                <textarea rows="3" placeholder="Onde trabalhou, por quanto tempo, cursos (MOPP, empilhadeira...)" {...bind('experiencia')} />
              </label>

              <div className="field span-2 file-field">
                <span className="field-label">Currículo (PDF ou Word, até {FILE_MAX_MB} MB)</span>
                {file ? (
                  <div className="file-chosen">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" />
                      <path d="M14 3v5h5" />
                    </svg>
                    <span>
                      <strong>{file.name}</strong>
                      <small>{formatSize(file.size)}</small>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        if (fileRef.current) fileRef.current.value = ''
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className={`file-drop${fileError ? ' is-invalid' : ''}`}>
                    <input ref={fileRef} type="file" accept={FILE_TYPES.join(',')} onChange={pickFile} />
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 16V4M7 9l5-5 5 5" />
                      <path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4" />
                    </svg>
                    <span>
                      <strong>Anexar currículo</strong>
                      <small>Toque para escolher o arquivo</small>
                    </span>
                  </label>
                )}
                <FieldError id="err-arquivo" msg={fileError} />
              </div>

              <div className="field span-2 consent-field">
                <label className={`consent${errors.consentimento ? ' is-invalid' : ''}`}>
                  <input
                    type="checkbox"
                    name="consentimento"
                    checked={f.consentimento}
                    onChange={(e) => (setField('consentimento', e.target.checked), e.target.checked && setError('consentimento', ''))}
                  />
                  <span>
                    Autorizo a Esteves Transportes a usar meus dados para processos seletivos, conforme a Lei Geral de
                    Proteção de Dados (LGPD). *
                  </span>
                </label>
                <FieldError id="err-consentimento" msg={errors.consentimento} />
              </div>
            </fieldset>

            <input type="text" name="_honey" className="hp" tabIndex="-1" autoComplete="off" value={f._honey} onChange={(e) => setField('_honey', e.target.value)} aria-hidden="true" />

            {status === 'error' && (
              <div className="quote-error" role="alert">
                Não foi possível enviar agora. Tente de novo ou mande o currículo para{' '}
                <a href={`mailto:${company.careersEmail}`}>{company.careersEmail}</a>.
              </div>
            )}

            <button type="submit" className="btn btn--primary quote-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar currículo'}
            </button>
            <small className={`quote-note${errorCount ? ' quote-note--error' : ''}`} role={errorCount ? 'alert' : undefined}>
              {errorCount
                ? `Corrija ${errorCount === 1 ? 'o campo marcado' : `os ${errorCount} campos marcados`} em vermelho.`
                : 'Seus dados ficam guardados só para processos seletivos da Esteves.'}
            </small>
          </form>
        )}
      </div>
    </section>
  )
}
