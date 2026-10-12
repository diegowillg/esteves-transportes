// Cabeçalho de seção com marco quilométrico.
export default function SectionHead({ km, eyebrow, title, children, light = false }) {
  return (
    <div className={`section-head${light ? ' section-head--light' : ''}`}>
      <div className="km" aria-hidden="true">
        <span>KM</span>
        <strong>{km}</strong>
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children && <p className="section-intro">{children}</p>}
      </div>
    </div>
  )
}
