import { useEffect, useRef, useState } from 'react'
import { getMode, type Mode } from './api'
import { MAX_STYLES, type HairColour } from './data/hairstyles'
import { StartStep } from './features/StartStep'
import { PhotoStep } from './features/PhotoStep'
import { StylesStep } from './features/StylesStep'
import { CompareStep, type PreviewCache } from './features/CompareStep'

const STEPS = ['Consent', 'Photo', 'Hairstyles', 'Compare']

export default function App() {
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [colour, setColour] = useState<HairColour | null>(null)
  const [mode, setMode] = useState<Mode>('checking')
  const previews = useRef<PreviewCache>(new Map())

  // Only checked on the consent page, so the mode can't change after the client agrees to it.
  useEffect(() => {
    if (step !== 0) return
    let current = true
    const check = () => void getMode().then((m) => current && setMode(m))
    check()
    const timer = import.meta.env.DEV ? setInterval(check, 4000) : undefined
    return () => {
      current = false
      clearInterval(timer)
    }
  }, [step])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  function changePhoto(url: string | null) {
    if (photo) URL.revokeObjectURL(photo)
    for (const job of previews.current.values()) job.then(URL.revokeObjectURL, () => {})
    previews.current = new Map()
    setPhoto(url)
  }

  function toggle(id: string) {
    setSelected((now) => {
      if (now.includes(id)) return now.filter((x) => x !== id)
      return now.length < MAX_STYLES ? [...now, id] : now
    })
  }

  function finish() {
    changePhoto(null)
    setSelected([])
    setColour(null)
    setStep(0)
  }

  return (
    <>
      <header className="topbar">
        <b>Hair Studio</b>
        <ol aria-label="Progress">
          {STEPS.map((name, i) => (
            <li key={name} className={i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
              {name}
            </li>
          ))}
        </ol>
      </header>
      <main>
        {step === 0 && <StartStep key={mode} mode={mode} onNext={() => setStep(1)} />}
        {step === 1 && (
          <PhotoStep photo={photo} onPhoto={changePhoto} onNext={() => setStep(2)} onBack={() => setStep(0)} />
        )}
        {step === 2 && (
          <StylesStep
            selected={selected}
            colour={colour}
            onToggle={toggle}
            onColour={setColour}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && photo && colour && (
          <CompareStep
            photo={photo}
            selected={selected}
            colour={colour}
            mode={mode}
            cache={previews.current}
            onBack={() => setStep(2)}
            onFinish={finish}
          />
        )}
      </main>
    </>
  )
}
