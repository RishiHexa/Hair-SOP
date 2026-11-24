import { useEffect, useState } from 'react'
import { COLOURS, MAX_STYLES } from './data/hairstyles'
import { StartStep } from './features/StartStep'
import { PhotoStep } from './features/PhotoStep'
import { StylesStep } from './features/StylesStep'
import { CompareStep } from './features/CompareStep'

const STEPS = ['Consent', 'Photo', 'Hairstyles', 'Compare']

export default function App() {
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [colour, setColour] = useState(COLOURS[0])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  function changePhoto(url: string | null) {
    if (photo) URL.revokeObjectURL(photo)
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
    setColour(COLOURS[0])
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
        {step === 0 && <StartStep onNext={() => setStep(1)} />}
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
        {step === 3 && photo && (
          <CompareStep photo={photo} selected={selected} colour={colour} onBack={() => setStep(2)} onFinish={finish} />
        )}
      </main>
    </>
  )
}
