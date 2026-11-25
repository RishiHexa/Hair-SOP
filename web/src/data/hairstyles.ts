export type Length = 'Short' | 'Medium' | 'Long'
export type Texture = 'Straight' | 'Wavy' | 'Curly' | 'Coily'
export type Back = 'none' | 'short' | 'bob' | 'lob' | 'long' | 'wavy' | 'curls' | 'afro' | 'bun' | 'pony'
export type Front = 'center' | 'side' | 'fringe' | 'swept' | 'buzz' | 'quiff'

export interface Hairstyle {
  id: string
  name: string
  length: Length
  texture: Texture
  back: Back
  front: Front
}

export interface HairColour {
  id: string
  name: string
  hex: string
}

export const LENGTHS: Length[] = ['Short', 'Medium', 'Long']
export const TEXTURES: Texture[] = ['Straight', 'Wavy', 'Curly', 'Coily']
export const MAX_STYLES = 4

export const HAIRSTYLES: Hairstyle[] = [
  { id: 'pixie', name: 'Pixie cut', length: 'Short', texture: 'Straight', back: 'short', front: 'swept' },
  { id: 'buzz', name: 'Buzz cut', length: 'Short', texture: 'Coily', back: 'none', front: 'buzz' },
  { id: 'quiff', name: 'Textured quiff', length: 'Short', texture: 'Wavy', back: 'none', front: 'quiff' },
  { id: 'blunt-bob', name: 'Blunt bob', length: 'Medium', texture: 'Straight', back: 'bob', front: 'center' },
  { id: 'french-bob', name: 'Bob with fringe', length: 'Medium', texture: 'Straight', back: 'bob', front: 'fringe' },
  { id: 'lob', name: 'Side-part lob', length: 'Medium', texture: 'Straight', back: 'lob', front: 'side' },
  { id: 'curly-mid', name: 'Rounded curls', length: 'Medium', texture: 'Curly', back: 'curls', front: 'side' },
  { id: 'afro', name: 'Afro', length: 'Medium', texture: 'Coily', back: 'afro', front: 'buzz' },
  { id: 'long-straight', name: 'Long and sleek', length: 'Long', texture: 'Straight', back: 'long', front: 'center' },
  { id: 'long-waves', name: 'Long waves', length: 'Long', texture: 'Wavy', back: 'wavy', front: 'side' },
  { id: 'top-bun', name: 'Top bun', length: 'Long', texture: 'Straight', back: 'bun', front: 'buzz' },
  { id: 'ponytail', name: 'Ponytail', length: 'Long', texture: 'Straight', back: 'pony', front: 'swept' },
]

export const COLOURS: HairColour[] = [
  { id: 'black', name: 'Black', hex: '#1f1b1c' },
  { id: 'dark-brown', name: 'Dark brown', hex: '#35231b' },
  { id: 'brown', name: 'Brown', hex: '#5a3825' },
  { id: 'light-brown', name: 'Light brown', hex: '#8f6540' },
  { id: 'auburn', name: 'Auburn', hex: '#8c3b22' },
  { id: 'copper', name: 'Copper', hex: '#c0662f' },
  { id: 'blonde', name: 'Blonde', hex: '#d9b36a' },
  { id: 'silver', name: 'Silver', hex: '#a9adb0' },
]
