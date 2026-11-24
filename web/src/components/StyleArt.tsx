import type { ReactNode } from 'react'
import type { Back, Front, Hairstyle } from '../data/hairstyles'

const curls = (rx: number, ry: number, r: number, count: number, cy: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = Math.PI * 0.86 + (i / (count - 1)) * Math.PI * 1.28
    return <circle key={i} cx={100 + Math.cos(a) * rx} cy={cy + Math.sin(a) * ry} r={r} />
  })

const SHORT = 'M58 100C52 52 76 40 100 40s48 12 42 60l-2 14H60z'

const BACK: Record<Back, ReactNode> = {
  none: null,
  short: <path d={SHORT} />,
  bob: <path d="M54 92C50 46 76 34 100 34s50 12 46 58l4 52q-50 10-100 0z" />,
  lob: <path d="M54 92C50 46 76 34 100 34s50 12 46 58l6 78q-52 8-104 0z" />,
  long: <path d="M54 92C50 46 76 34 100 34s50 12 46 58l8 108H46z" />,
  wavy: <path d="M54 88C50 44 76 32 100 32s50 12 46 56c-2 18 14 24 8 42s10 30 4 70H42c-6-40 10-52 4-70s10-24 8-42z" />,
  curls: (
    <>
      <path d={SHORT} />
      {curls(50, 54, 17, 12, 96)}
      {[[52, 136], [148, 136], [56, 152], [144, 152]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="15" />
      ))}
    </>
  ),
  afro: (
    <>
      <ellipse cx="100" cy="84" rx="62" ry="58" />
      {curls(60, 56, 10, 20, 84)}
    </>
  ),
  bun: (
    <>
      <circle cx="100" cy="28" r="20" />
      <path d="M60 92c-4-38 18-50 40-50s44 12 40 50z" />
    </>
  ),
  pony: (
    <>
      <path d={SHORT} />
      <path d="M134 56c30-6 40 24 34 50s6 40-8 66c-14-16-4-40-8-60s-6-30-22-34z" />
    </>
  ),
}

const FRONT: Record<Front, string> = {
  center: 'M100 42C74 42 58 64 60 104c6-22 28-32 40-50 12 18 34 28 40 50 2-40-14-62-40-62z',
  side: 'M78 46C62 54 56 78 60 104c4-20 12-34 22-46 16 20 46 20 58 46 4-40-22-66-62-58z',
  fringe: 'M60 104C54 62 74 42 100 42s46 20 40 62c-2-10-3-14-6-20H66c-3 6-4 10-6 20z',
  swept: 'M60 100C54 50 78 36 104 38c32 0 44 24 36 62-4-14-12-24-24-30-18 12-40 8-50 12-3 5-5 10-6 18z',
  buzz: 'M61 92C58 58 78 45 100 45s42 13 39 47c-5-19-19-28-39-28s-34 9-39 28z',
  quiff: 'M61 92C56 66 62 40 92 32c30-8 54 12 47 60-3-14-9-24-17-28-18 4-38 2-50-2-6 8-9 18-11 30z',
}

export function StyleArt({ style, colour }: { style: Hairstyle; colour: string | null }) {
  return (
    <svg className="art" viewBox="0 0 200 200" aria-hidden="true">
      <g fill={colour ?? '#4a3a33'}>
        <g className="art-back">{BACK[style.back]}</g>
        <path d="M40 200c2-24 24-32 46-36h28c22 4 44 12 46 36z" fill="#0f5c4c" />
        <path d="M86 134h28v32q-14 14-28 0z" fill="#cf9a76" />
        <ellipse cx="100" cy="98" rx="39" ry="48" fill="#e0b08d" />
        <path d="M85 101h8M107 101h8M93 124q7 5 14 0" fill="none" stroke="#6b4632" strokeWidth="2.5" strokeLinecap="round" />
        <path d={FRONT[style.front]} />
      </g>
    </svg>
  )
}
