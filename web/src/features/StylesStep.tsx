import { useState } from 'react'
import { StyleArt } from '../components/StyleArt'
import {
  COLOURS, HAIRSTYLES, LENGTHS, MAX_STYLES, TEXTURES,
  type HairColour, type Length, type Texture,
} from '../data/hairstyles'

interface Props {
  selected: string[]
  colour: HairColour
  onToggle: (id: string) => void
  onColour: (colour: HairColour) => void
  onNext: () => void
  onBack: () => void
}

interface FilterProps<T extends string> {
  label: string
  options: T[]
  value: T | null
  onChange: (value: T | null) => void
}

function Filter<T extends string>({ label, options, value, onChange }: FilterProps<T>) {
  return (
    <div className="filter" role="group" aria-label={label}>
      <span>{label}</span>
      <button className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>All</button>
      {options.map((o) => (
        <button key={o} className="chip" aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  )
}

export function StylesStep({ selected, colour, onToggle, onColour, onNext, onBack }: Props) {
  const [length, setLength] = useState<Length | null>(null)
  const [texture, setTexture] = useState<Texture | null>(null)
  const full = selected.length >= MAX_STYLES
  const shown = HAIRSTYLES.filter((s) => (!length || s.length === length) && (!texture || s.texture === texture))

  function clearFilters() {
    setLength(null)
    setTexture(null)
  }

  return (
    <section>
      <h1>Choose hairstyles</h1>
      <Filter label="Length" options={LENGTHS} value={length} onChange={setLength} />
      <Filter label="Texture" options={TEXTURES} value={texture} onChange={setTexture} />
      <div className="filter" role="group" aria-label="Colour">
        <span>Colour</span>
        {COLOURS.map((c) => (
          <button key={c.id} className="chip" aria-pressed={colour.id === c.id} onClick={() => onColour(c)}>
            {c.hex && <i className="swatch" style={{ background: c.hex }} />}
            {c.name}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <p>No hairstyles match these filters.</p>
          <button className="btn" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <div className="grid">
          {shown.map((s) => {
            const on = selected.includes(s.id)
            return (
              <button key={s.id} className="card" aria-pressed={on} disabled={full && !on} onClick={() => onToggle(s.id)}>
                <StyleArt style={s} colour={colour.hex} />
                <strong>{s.name}</strong>
                <small>{s.length}, {s.texture.toLowerCase()}</small>
              </button>
            )
          })}
        </div>
      )}

      <footer className="actions">
        <button className="btn" onClick={onBack}>Back</button>
        <span aria-live="polite">{selected.length} of {MAX_STYLES} selected</span>
        <button className="btn primary" disabled={selected.length === 0} onClick={onNext}>Compare</button>
      </footer>
    </section>
  )
}
