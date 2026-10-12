// Botões de escolha única (ex.: Galpão / Rodoviária / A definir)
export default function Segmented({ name, value, options, onChange }) {
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
