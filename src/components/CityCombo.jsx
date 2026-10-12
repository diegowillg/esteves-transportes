import { useEffect, useId, useRef, useState } from 'react'
import { UF_NAMES, cityKey, exactMatches, loadCities, searchCities } from '../lib/cities.js'

// Destaca no nome da cidade o trecho que a pessoa digitou
function Highlight({ name, query }) {
  const q = cityKey(query).replace(/\s+[a-z]{2}$/, (m) => (UF_NAMES[m.trim().toUpperCase()] ? '' : m))
  const i = q ? cityKey(name).indexOf(q) : -1
  if (i < 0) return name
  return (
    <>
      {name.slice(0, i)}
      <mark>{name.slice(i, i + q.length)}</mark>
      {name.slice(i + q.length)}
    </>
  )
}

const Pin = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7-7.2-7-12a7 7 0 0114 0c0 4.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.6" />
  </svg>
)

/**
 * Campo de cidade com busca em todos os municípios do Brasil.
 * value: { city, uf } — uf vazio enquanto a cidade não foi escolhida na lista.
 */
export default function CityCombo({ label, name, value, error, onType, onSelect, onResolve }) {
  const uid = useId()
  const listId = `${uid}-lista`
  const inputRef = useRef(null)
  const [index, setIndex] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const { items: results, total } = searchCities(index, value.city)
  const selected = Boolean(value.uf)

  useEffect(() => setActive(0), [value.city])

  function ensureIndex() {
    if (!index) loadCities().then(setIndex)
  }

  function choose(c) {
    onSelect(c.name, c.uf)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault()
      choose(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function onBlur() {
    setOpen(false)
    if (selected || !value.city.trim()) return onResolve(value.city, null)
    // digitou sem escolher: aceita se o nome for único no país
    loadCities().then((idx) => {
      const exact = exactMatches(idx, value.city)
      if (exact.length === 1) onSelect(exact[0].name, exact[0].uf)
      else onResolve(value.city, exact.length > 1 ? 'ambiguous' : 'notfound')
    })
  }

  const showList = open && !selected && value.city.trim().length > 0

  return (
    <div className="field combo">
      <span className="field-label" id={`${uid}-rotulo`}>
        {label}
      </span>
      <div className="combo-anchor">
      <div className={`combo-box${selected ? ' is-selected' : ''}${error ? ' is-invalid' : ''}`}>
        <Pin />
        <input
          ref={inputRef}
          name={name}
          role="combobox"
          aria-labelledby={`${uid}-rotulo`}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && results[active] ? `${uid}-op-${active}` : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${uid}-erro` : undefined}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck="false"
          maxLength={60}
          placeholder="Digite a cidade"
          value={value.city}
          onFocus={() => {
            ensureIndex()
            setOpen(true)
          }}
          onChange={(e) => {
            ensureIndex()
            onType(e.target.value.replace(/[^\p{L}\s'-]/gu, '').replace(/\s{2,}/g, ' '))
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        {selected && (
          <span className="combo-uf" title={UF_NAMES[value.uf]}>
            {value.uf}
          </span>
        )}
        {value.city && (
          <button
            type="button"
            className="combo-clear"
            aria-label="Limpar cidade"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onType('')
              inputRef.current?.focus()
            }}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        )}
      </div>

      {showList && (
        <ul className="combo-list" role="listbox" id={listId} aria-label={label}>
          {!index && <li className="combo-empty">Carregando cidades…</li>}
          {index && results.length === 0 && <li className="combo-empty">Nenhuma cidade encontrada</li>}
          {results.map((c, i) => (
            <li
              key={`${c.name}-${c.uf}`}
              id={`${uid}-op-${i}`}
              role="option"
              aria-selected={i === active}
              className={`combo-option${i === active ? ' is-active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(c)}
            >
              <Pin />
              <span className="combo-text">
                <span className="combo-name">
                  <Highlight name={c.name} query={value.city} />
                </span>
                <span className="combo-state">{UF_NAMES[c.uf]}</span>
              </span>
              <b className="combo-chip">{c.uf}</b>
            </li>
          ))}
          {total > results.length && (
            <li className="combo-more" aria-hidden="true">
              Mostrando {results.length} de {total} cidades. Continue digitando para refinar.
            </li>
          )}
        </ul>
      )}
      </div>

      {error && (
        <small className="field-error" id={`${uid}-erro`} role="alert">
          {error}
        </small>
      )}
    </div>
  )
}
