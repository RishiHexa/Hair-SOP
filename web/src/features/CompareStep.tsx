import { useState } from 'react'
import { StyleArt } from '../components/StyleArt'
import { HAIRSTYLES, type HairColour, type Hairstyle } from '../data/hairstyles'

interface Props {
  photo: string
  selected: string[]
  colour: HairColour
  onBack: () => void
  onFinish: () => void
}

interface BeforeAfterProps {
  photo: string
  style: Hairstyle
  colour: HairColour
}

function BeforeAfter({ photo, style, colour }: BeforeAfterProps) {
  const [split, setSplit] = useState(50)

  return (
    <figure className="result">
      <div className="frame">
        <img src={photo} alt="Client before" />
        {/* Placeholder: swap for the generated image once the backend exists. */}
        <div className="after" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          <StyleArt style={style} colour={colour.hex} />
        </div>
        <i className="divider" style={{ left: `${split}%` }} />
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          aria-label={`Before and after, ${style.name}`}
          onChange={(e) => setSplit(Number(e.target.value))}
        />
        <span className="tag left">Before</span>
        <span className="tag right">Sample</span>
      </div>
      <figcaption>
        <strong>{style.name}</strong>
        <small>{colour.hex ? colour.name : 'Current colour'}</small>
      </figcaption>
    </figure>
  )
}

export function CompareStep({ photo, selected, colour, onBack, onFinish }: Props) {
  const styles = HAIRSTYLES.filter((s) => selected.includes(s.id))

  return (
    <section>
      <h1>Compare</h1>
      <p className="banner">Sample view. The drawings mark where each generated photo will appear.</p>
      <div className="results">
        {styles.map((s) => <BeforeAfter key={s.id} photo={photo} style={s} colour={colour} />)}
      </div>
      <footer className="actions">
        <button className="btn" onClick={onBack}>Change hairstyles</button>
        <button className="btn primary" onClick={onFinish}>Finish and remove photo</button>
      </footer>
    </section>
  )
}
