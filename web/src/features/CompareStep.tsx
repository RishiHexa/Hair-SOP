import { useEffect, useState } from 'react'
import { generate, type Mode } from '../api'
import { StyleArt } from '../components/StyleArt'
import { HAIRSTYLES, type HairColour, type Hairstyle } from '../data/hairstyles'

/** Generated images for the current photo, keyed by style and colour. */
export type PreviewCache = Map<string, Promise<string>>

interface Props {
  photo: string
  selected: string[]
  colour: HairColour
  mode: Mode
  cache: PreviewCache
  onBack: () => void
  onFinish: () => void
}

interface BeforeAfterProps {
  photo: string
  style: Hairstyle
  colour: HairColour
  mode: Mode
  cache: PreviewCache
}

function BeforeAfter({ photo, style, colour, mode, cache }: BeforeAfterProps) {
  const [split, setSplit] = useState(50)
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const generates = mode === 'live' || mode === 'mock'
  const key = `${style.id}:${colour.id}`

  useEffect(() => {
    if (!generates) return
    let current = true
    setError('')
    let job = cache.get(key)
    if (!job) {
      job = generate(photo, style.id, colour.id)
      cache.set(key, job)
      job.catch(() => cache.delete(key))
    }
    job.then(
      (url) => current && setImage(url),
      (e: Error) => current && setError(e.message),
    )
    return () => {
      current = false
    }
  }, [generates, cache, key, photo, style.id, colour.id, attempt])

  const ready = image !== null || mode === 'sample'

  return (
    <figure className="result">
      <div className="frame">
        <img src={photo} alt="Client before" />
        {ready && (
          <>
            <div className="after" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
              {image ? <img src={image} alt={`Client with ${style.name}`} /> : <StyleArt style={style} colour={colour.hex} />}
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
            <span className="tag right">{image ? 'After' : 'Sample'}</span>
          </>
        )}
        {!ready && (
          <div className="pending" role="status">
            {error ? (
              <>
                <p>{error}</p>
                <button className="btn" onClick={() => setAttempt((n) => n + 1)}>Try again</button>
              </>
            ) : (
              <>
                <i className="spinner" />
                <p>Creating preview</p>
              </>
            )}
          </div>
        )}
      </div>
      <figcaption>
        <strong>{style.name}</strong>
        <small>{colour.name}</small>
      </figcaption>
      {image && (
        <a className="btn save" href={image} download={`${style.id}-${colour.id}.jpg`}>Save image</a>
      )}
    </figure>
  )
}

const BANNERS: Partial<Record<Mode, string>> = {
  live: 'AI previews. Real results depend on hair type, length and condition.',
  mock: 'Test mode. Previews are grey copies of the photo.',
  sample: 'Sample view. The drawings mark where each generated photo will appear.',
}

export function CompareStep({ photo, selected, colour, mode, cache, onBack, onFinish }: Props) {
  const styles = HAIRSTYLES.filter((s) => selected.includes(s.id))

  return (
    <section>
      <h1>Compare</h1>
      {BANNERS[mode] && <p className="banner">{BANNERS[mode]}</p>}
      <div className="results">
        {styles.map((s) => (
          <BeforeAfter key={`${s.id}:${colour.id}`} photo={photo} style={s} colour={colour} mode={mode} cache={cache} />
        ))}
      </div>
      <footer className="actions">
        <button className="btn" onClick={onBack}>Change hairstyles</button>
        <button className="btn primary" onClick={onFinish}>Finish and remove photo</button>
      </footer>
    </section>
  )
}
