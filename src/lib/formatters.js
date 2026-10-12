// Formatação (máscaras) e validação dos campos do formulário de cotação.
// - mask*: aplicadas enquanto a pessoa digita
// - normalize*: aplicadas ao sair do campo e no envio
// - validate*: retornam a mensagem de erro, ou '' quando está tudo certo

export const digits = (v = '') => v.replace(/\D/g, '')

/* ------------------------------------------------------------------ */
/* CPF / CNPJ                                                          */
/* ------------------------------------------------------------------ */
export function maskCPF(v) {
  const d = digits(v).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
}

export function maskCNPJ(v) {
  const d = digits(v).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/\/(\d{4})(\d{1,2})$/, '/$1-$2')
}

export function isValidCPF(v) {
  const d = digits(v)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const calc = (len) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i)
    const r = (sum * 10) % 11
    return r === 10 ? 0 : r
  }
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10])
}

export function isValidCNPJ(v) {
  const d = digits(v)
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false
  const calc = (len) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = weights.reduce((acc, w, i) => acc + Number(d[i]) * w, 0)
    const r = sum % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13])
}

/* ------------------------------------------------------------------ */
/* Telefone / WhatsApp: (00)00000-0000                                 */
/* ------------------------------------------------------------------ */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87,
  88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
])

export function maskPhone(v) {
  let d = digits(v)
  // quem cola com +55 ou 0 na frente
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2)
  if (d.length > 11 && d.startsWith('0')) d = d.slice(1)
  d = d.slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  const ddd = d.slice(0, 2)
  const n = d.slice(2)
  if (n.length <= 4) return `(${ddd})${n}`
  if (d.length <= 10) return `(${ddd})${n.slice(0, 4)}-${n.slice(4)}`
  return `(${ddd})${n.slice(0, 5)}-${n.slice(5)}`
}

export function validatePhone(v, required) {
  const d = digits(v)
  if (!d) return required ? 'Informe o WhatsApp.' : ''
  if (d.length < 10) return 'Número incompleto.'
  if (!DDDS.has(Number(d.slice(0, 2)))) return 'DDD inválido.'
  if (d.length === 11 && d[2] !== '9') return 'Celular começa com 9 após o DDD.'
  return ''
}

/* ------------------------------------------------------------------ */
/* E-mail                                                              */
/* ------------------------------------------------------------------ */
export const maskEmail = (v) => v.replace(/\s/g, '').toLowerCase()

export function validateEmail(v, required) {
  if (!v) return required ? 'Informe seu e-mail.' : ''
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v)) return 'E-mail inválido.'
  return ''
}

/* ------------------------------------------------------------------ */
/* Textos: nome, cidade, mercadoria                                    */
/* ------------------------------------------------------------------ */
const SMALL_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'nas', 'nos'])

export const collapseSpaces = (v) => v.replace(/\s+/g, ' ').trim()

export function titleCase(v) {
  return collapseSpaces(v)
    .toLowerCase()
    .split(' ')
    .map((w, i) => {
      if (i > 0 && SMALL_WORDS.has(w)) return w
      return w.replace(/(^|[-'’])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase())
    })
    .join(' ')
}

// Nome de pessoa: sem números ou símbolos estranhos
export const maskPersonName = (v) => v.replace(/[^\p{L}\s'’.-]/gu, '').replace(/\s{2,}/g, ' ')

export function validateName(v, empresa) {
  const s = collapseSpaces(v)
  if (!s) return empresa ? 'Informe a razão social.' : 'Informe seu nome.'
  if (s.length < 3) return 'Nome muito curto.'
  if (!empresa && s.split(' ').length < 2) return 'Informe nome e sobrenome.'
  return ''
}

const UFS = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
  'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
])

// "uberaba mg", "Uberaba-MG", "uberaba/mg", "Uberaba, MG" -> "Uberaba / MG"
export function normalizeCity(v) {
  const s = collapseSpaces(v)
  if (!s) return ''
  const m = s.match(/^(.*?)[\s,/-]+([a-zA-Z]{2})$/)
  if (m && UFS.has(m[2].toUpperCase())) return `${titleCase(m[1].replace(/[,/-]+$/, ''))} / ${m[2].toUpperCase()}`
  return titleCase(s)
}

export function validateCity(v) {
  if (!collapseSpaces(v)) return 'Informe a cidade.'
  const m = v.match(/ \/ ([A-Z]{2})$/)
  if (!m) return 'Informe a cidade e a UF. Ex.: Uberaba / MG'
  return ''
}

export function sentenceCase(v) {
  const s = collapseSpaces(v)
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

/* ------------------------------------------------------------------ */
/* Números: peso, valor, volumes                                       */
/* ------------------------------------------------------------------ */
// Peso em kg: vírgula como decimal (ponto digitado vira vírgula), até 3 casas.
// Sem ponto de milhar no campo, para "1.250" nunca ser confundido com 1,25.
export function maskWeight(v) {
  let s = v.replace(/\./g, ',').replace(/[^\d,]/g, '')
  const [int, ...rest] = s.split(',')
  s = int.replace(/^0+(?=\d)/, '').slice(0, 6)
  if (rest.length) s += ',' + rest.join('').slice(0, 3)
  return s
}

export function normalizeWeight(v) {
  const n = parseWeight(v)
  return n ? n.toLocaleString('pt-BR', { maximumFractionDigits: 3, useGrouping: false }) : ''
}

export const parseWeight = (v) => Number(String(v).replace(',', '.')) || 0

export function validateWeight(v) {
  const n = parseWeight(v)
  if (!v) return 'Informe o peso.'
  if (n <= 0) return 'Peso inválido.'
  return ''
}

export function maskMoney(v) {
  const d = digits(v).replace(/^0+/, '').slice(0, 11)
  if (!d) return ''
  return (Number(d) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function validateMoney(v) {
  if (!v) return 'Informe o valor.'
  if (Number(digits(v)) <= 0) return 'Valor inválido.'
  return ''
}

export const maskInteger = (v, max = 5) => digits(v).replace(/^0+/, '').slice(0, max)
