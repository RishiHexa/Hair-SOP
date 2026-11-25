/** Keys match the ids in web/src/data/hairstyles.ts. Fixed text only: nothing typed by users reaches the model. */
export const STYLES: Record<string, string> = {
  pixie: 'a short pixie cut with soft side-swept bangs, ears and neck visible, no long hair',
  buzz: 'a very short even buzz cut, ears and neck visible, no long hair',
  quiff: 'a short textured quiff, volume swept up and back at the front, short tapered sides',
  'blunt-bob': 'a chin-length straight blunt bob with a centre part and no fringe',
  'french-bob': 'a chin-length straight bob with a full straight fringe',
  lob: 'a straight collarbone-length long bob with a deep side part',
  'curly-mid': 'shoulder-length voluminous rounded curly hair with a side part',
  afro: 'a full, rounded natural afro with coily texture',
  'long-straight': 'very long, sleek straight hair below the shoulders with a centre part',
  'long-waves': 'long loose waves below the shoulders with a side part',
  'top-bun': 'hair pulled up smoothly into a neat high bun on top of the head, ears and neck visible',
  ponytail: 'hair pulled back into a high wavy ponytail falling over one shoulder, with side-swept bangs',
}

export const COLOURS: Record<string, string> = {
  keep: 'Keep the current natural hair colour.',
  black: 'The hair colour is natural black.',
  brown: 'The hair colour is medium chestnut brown.',
  auburn: 'The hair colour is deep auburn red-brown.',
  copper: 'The hair colour is copper.',
  blonde: 'The hair colour is golden blonde.',
  silver: 'The hair colour is silver grey.',
}

export function buildPrompt(style: string, colour: string): string {
  return (
    `Change only the hairstyle of the person in image 0 to ${STYLES[style]}. ${COLOURS[colour]} ` +
    'Keep the exact same person: identical face, facial features, facial hair, glasses, skin tone, expression, ' +
    'head size and position, clothing, background, lighting and camera framing. Photorealistic.'
  )
}
