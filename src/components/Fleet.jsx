import { useState } from 'react'
import { fleetByCompany, partnerByCode } from '../data/site.js'
import SectionHead from './SectionHead.jsx'
import { vehicleById } from './Vehicles.jsx'
import { Coach } from './Coach.jsx'

function VehicleArt({ v }) {
  if (v.coach) return <Coach className={`fleet-svg fleet-svg--coach-${v.coach.deck}`} title={v.name} {...v.coach} />
  const Vehicle = vehicleById[v.vehicle]
  const livery = v.livery ? partnerByCode[v.livery].livery : undefined
  return <Vehicle className={`fleet-svg fleet-svg--${v.vehicle}`} title={v.name} brand={v.brand} livery={livery} />
}

export default function Fleet() {
  const [companyCode, setCompanyCode] = useState(fleetByCompany[0].code)
  const [vehicleKey, setVehicleKey] = useState(fleetByCompany[0].vehicles[0].key)
  const company = fleetByCompany.find((c) => c.code === companyCode)
  const v = company.vehicles.find((x) => x.key === vehicleKey) ?? company.vehicles[0]

  function pickCompany(c) {
    setCompanyCode(c.code)
    setVehicleKey(c.vehicles[0].key)
  }

  return (
    <section className="section section--dark" id="frota">
      <div className="container">
        <SectionHead km="03" eyebrow="Frota" title="Os veículos de cada transportadora." light>
          Escolha a transportadora para ver como a sua carga viaja: utilitário e caminhão a partir do galpão,
          ou no bagageiro dos ônibus a partir da rodoviária.
        </SectionHead>

        <div className="fleet">
          <div className="fleet-tabs" role="tablist" aria-label="Transportadoras">
            {fleetByCompany.map((c) => (
              <button
                key={c.code}
                role="tab"
                aria-selected={c.code === companyCode}
                className="fleet-tab"
                onClick={() => pickCompany(c)}
              >
                <span className="fleet-tab-logo">
                  <img src={c.logo} alt="" />
                </span>
                <span className="fleet-tab-text">
                  <span className="fleet-tab-tag">{c.base.split(' · ')[1]}</span>
                  <span className="fleet-tab-name">{c.shortName}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="fleet-stage" role="tabpanel" aria-label={company.name}>
            <div className="fleet-visual">
              <div className="fleet-vehicle" key={v.key}>
                <VehicleArt v={v} />
              </div>
              <div className="fleet-ground" aria-hidden="true" />
            </div>
            <div className="fleet-info">
              <span className="fleet-kicker">
                {company.name} · <span className="nowrap">{company.base}</span>
              </span>
              <h3>{v.name}</h3>
              <p>{v.use}</p>

              {company.vehicles.length > 1 && (
                <div className="fleet-picker" role="group" aria-label={`Veículos da ${company.name}`}>
                  {company.vehicles.map((x) => (
                    <button
                      key={x.key}
                      type="button"
                      className="fleet-chip"
                      aria-pressed={x.key === v.key}
                      onClick={() => setVehicleKey(x.key)}
                    >
                      {x.name}
                    </button>
                  ))}
                </div>
              )}

              <dl className="specs">
                <div>
                  <dt>Tipo</dt>
                  <dd>{v.tag}</dd>
                </div>
                <div>
                  <dt>Capacidade</dt>
                  <dd>{v.payload}</dd>
                </div>
                <div>
                  <dt>Volume</dt>
                  <dd>{v.volume}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
