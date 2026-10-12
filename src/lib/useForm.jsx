// Estado, máscaras e validação compartilhados pelos formulários do site.
// rules = { campo: { mask?(v, values), normalize?(v, values), validate?(v, values) } }
import { useState } from 'react'

export function useForm(initial, rules) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  const run = (fn, v, vals) => (fn ? fn(v, vals) : v)

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function setError(name, msg) {
    setErrors((prev) => ({ ...prev, [name]: msg }))
  }

  // props para <input>/<textarea>/<select>: máscara ao digitar, padroniza e valida ao sair
  function bind(name) {
    const r = rules[name] || {}
    return {
      name,
      value: values[name],
      'aria-invalid': errors[name] ? 'true' : undefined,
      'aria-describedby': errors[name] ? `err-${name}` : undefined,
      onChange: (e) => {
        const v = run(r.mask, e.target.value, values)
        setField(name, v)
        if (errors[name] && !run(r.validate, v, { ...values, [name]: v })) setError(name, '')
      },
      onBlur: (e) => {
        const v = r.normalize ? r.normalize(e.target.value, values) : e.target.value
        setField(name, v)
        if (r.validate) setError(name, r.validate(v, { ...values, [name]: v }) || '')
      },
    }
  }

  // padroniza tudo, valida tudo; devolve os dados prontos e o primeiro campo com erro
  function validateAll() {
    const data = { ...values }
    for (const [name, r] of Object.entries(rules)) if (r.normalize) data[name] = r.normalize(data[name], data)
    const errs = {}
    for (const [name, r] of Object.entries(rules)) if (r.validate) errs[name] = r.validate(data[name], data) || ''
    setValues(data)
    setErrors(errs)
    const first = Object.keys(rules).find((k) => errs[k])
    return { data, first, count: Object.values(errs).filter(Boolean).length }
  }

  function reset() {
    setValues(initial)
    setErrors({})
  }

  return { values, setValues, setField, errors, setError, setErrors, bind, validateAll, reset }
}

export function FieldError({ id, msg }) {
  if (!msg) return null
  return (
    <small className="field-error" id={id} role="alert">
      {msg}
    </small>
  )
}

// Rola até o campo com erro e coloca o cursor nele
export function focusField(form, name) {
  const el = form?.querySelector(`[name="${name}"]`)
  el?.focus()
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}
