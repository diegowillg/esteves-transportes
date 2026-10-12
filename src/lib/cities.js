// Municípios do Brasil (lista oficial do IBGE, guardada em src/data/municipios.json).
// A lista só é baixada quando a pessoa usa o campo de cidade (import dinâmico).

export const UF_NAMES = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
}

// Entre cidades com o MESMO nome, estas UFs aparecem primeiro (região da Esteves)
const PREFERRED = ['MG', 'SP', 'GO', 'MS', 'RJ', 'ES', 'MT', 'PR', 'BA', 'DF']

// Comparação sem acentos, maiúsculas ou pontuação: "uberlandia" = "Uberlândia"
export const cityKey = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

let indexPromise = null

// [{ name, uf, key }] com todos os municípios
export function loadCities() {
  if (!indexPromise) {
    indexPromise = import('../data/municipios.json').then(({ default: byUf }) =>
      Object.entries(byUf).flatMap(([uf, names]) => names.map((name) => ({ name, uf, key: cityKey(name) })))
    )
  }
  return indexPromise
}

// Busca: aceita "uberaba", "uberl", "santa cruz sp", "sao jose dos campos"
// Retorna { items, total }: até `limit` cidades e o total encontrado
export function searchCities(index, query, limit = 60) {
  let q = cityKey(query)
  if (!index || !q) return { items: [], total: 0 }
  // UF no fim da busca ("santa cruz sp") filtra o estado
  let ufFilter = null
  const m = q.match(/^(.*\S)\s+([a-z]{2})$/)
  if (m && UF_NAMES[m[2].toUpperCase()]) {
    ufFilter = m[2].toUpperCase()
    q = m[1]
  }
  const results = []
  for (const c of index) {
    if (ufFilter && c.uf !== ufFilter) continue
    let score
    if (c.key === q) score = 0
    else if (c.key.startsWith(q)) score = 1
    else if (c.key.includes(' ' + q)) score = 2
    else if (c.key.includes(q)) score = 3
    else continue
    const pref = PREFERRED.indexOf(c.uf)
    results.push({ ...c, score, pref: pref === -1 ? 99 : pref })
  }
  // melhor correspondência primeiro; depois ordem alfabética entre TODOS os estados
  results.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, 'pt-BR') || a.pref - b.pref)
  return { items: results.slice(0, limit), total: results.length }
}

// Cidade exata digitada sem escolher na lista: só aceita se for única
// (ex.: "Uberaba" -> Uberaba/MG; "Santa Cruz" existe em vários estados -> ambíguo)
export function exactMatches(index, query) {
  return searchCities(index, query, 100).items.filter((c) => c.score === 0)
}
