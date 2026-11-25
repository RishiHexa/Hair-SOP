import { useState } from 'react'
import type { Mode } from '../api'

const NOTES: Record<Mode, string> = {
  checking: 'Checking the preview service.',
  live: 'The photo is sent to Cloudflare to create each preview. This app does not store it.',
  mock: 'Test mode. The photo stays on this computer.',
  sample: 'In this demo, the photo stays in this browser and is never uploaded.',
}

export function StartStep({ mode, onNext }: { mode: Mode; onNext: () => void }) {
  const [adult, setAdult] = useState(false)
  const [consent, setConsent] = useState(false)

  return (
    <section className="narrow">
      <h1>Show your client the cut before you start</h1>
      <p className="lead">Take a photo, pick up to four hairstyles and compare them together.</p>
      <div className="panel">
        <h2>Before taking a photo</h2>
        <label className="check">
          <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
          <span>My client is 18 or older</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            My client agrees to their photo being {mode === 'live' ? 'sent to Cloudflare' : 'used'} to create AI hairstyle
            previews
          </span>
        </label>
        <button className="btn primary" disabled={!adult || !consent || mode === 'checking'} onClick={onNext}>
          Start consultation
        </button>
      </div>
      <p className="note">{NOTES[mode]}</p>
    </section>
  )
}
