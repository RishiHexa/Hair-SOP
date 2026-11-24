import { useState } from 'react'

export function StartStep({ onNext }: { onNext: () => void }) {
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
          <span>My client agrees to their photo being used for this consultation</span>
        </label>
        <button className="btn primary" disabled={!adult || !consent} onClick={onNext}>
          Start consultation
        </button>
      </div>
      <p className="note">In this demo, the photo stays in this browser and is never uploaded.</p>
    </section>
  )
}
