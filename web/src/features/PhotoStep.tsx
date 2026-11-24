import { useState, type ChangeEvent, type DragEvent } from 'react'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 10
const MIN_SIDE = 400

interface Props {
  photo: string | null
  onPhoto: (url: string | null) => void
  onNext: () => void
  onBack: () => void
}

export function PhotoStep({ photo, onPhoto, onNext, onBack }: Props) {
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  async function accept(file?: File) {
    if (!file) return
    setError('')
    if (!TYPES.includes(file.type)) return setError('Choose a JPG, PNG or WebP photo.')
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Choose a photo under ${MAX_MB} MB.`)

    const url = URL.createObjectURL(file)
    const image = new Image()
    image.src = url
    try {
      await image.decode()
    } catch {
      URL.revokeObjectURL(url)
      return setError("This photo couldn't be opened. Try another one.")
    }
    if (Math.min(image.naturalWidth, image.naturalHeight) < MIN_SIDE) {
      URL.revokeObjectURL(url)
      return setError(`This photo is too small. Use one at least ${MIN_SIDE} pixels wide and tall.`)
    }
    onPhoto(url)
  }

  function pick(e: ChangeEvent<HTMLInputElement>) {
    void accept(e.target.files?.[0])
    e.target.value = ''
  }

  function drop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    void accept(e.dataTransfer.files[0])
  }

  return (
    <section>
      <h1>Add a photo</h1>
      <div className="photo-layout">
        <div
          className={`dropzone${dragging ? ' dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
        >
          {photo ? <img src={photo} alt="Client" /> : <p>Drop a photo here, or use the buttons</p>}
        </div>
        <div>
          <div className="stack">
            <label className="btn primary">
              {photo ? 'Choose another photo' : 'Choose photo'}
              <input className="sr-only" type="file" accept={TYPES.join(',')} onChange={pick} />
            </label>
            <label className="btn touch-only">
              Take photo
              <input className="sr-only" type="file" accept="image/*" capture="user" onChange={pick} />
            </label>
            {photo && <button className="btn" onClick={() => onPhoto(null)}>Remove photo</button>}
          </div>
          <p className="error" role="alert">{error}</p>
          <h2>For the best result</h2>
          <ul className="tips">
            <li>Face the camera straight on</li>
            <li>Keep the whole head and shoulders in frame</li>
            <li>Use even light and a plain background</li>
            <li>Take off hats and sunglasses</li>
          </ul>
        </div>
      </div>
      <footer className="actions">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn primary" disabled={!photo} onClick={onNext}>Choose hairstyles</button>
      </footer>
    </section>
  )
}
