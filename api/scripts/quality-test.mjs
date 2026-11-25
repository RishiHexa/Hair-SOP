// Runs every photo in quality-test/photos through a few hairstyles and writes one comparison sheet per photo.
// Only use photos of adults who agreed to it: unless IMAGE_PROVIDER=mock, they are sent to Cloudflare.
import { mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { join, parse } from 'node:path'
import sharp from 'sharp'
import { buildPrompt } from '../dist/generations/prompts.js'
import { CloudflareProvider } from '../dist/providers/cloudflare.provider.js'
import { MockProvider } from '../dist/providers/mock.provider.js'

const root = join(import.meta.dirname, '../../quality-test')
const photos = join(root, 'photos')
const results = join(root, 'results')
const tests = [['buzz', 'black'], ['quiff', 'dark-brown'], ['french-bob', 'black'], ['curly-mid', 'dark-brown'], ['long-waves', 'copper']]
const tile = { width: 384, height: 480 }

mkdirSync(photos, { recursive: true })
mkdirSync(results, { recursive: true })
const files = readdirSync(photos).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).slice(0, 8)
if (!files.length) {
  console.log(`No photos found. Add JPG, PNG or WebP files to ${photos}`)
  process.exit(1)
}

const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token, IMAGE_PROVIDER } = process.env
if (IMAGE_PROVIDER !== 'mock' && !(account && token)) throw new Error('Cloudflare settings are missing from .env')
const provider = IMAGE_PROVIDER === 'mock' ? new MockProvider() : new CloudflareProvider(account.trim(), token.trim())
console.log(`${files.length} photos, ${files.length * tests.length} images, provider: ${provider.name}`)

// Same 4:5 crop as the web app: centred, keeping more of the top.
async function crop(file) {
  const upright = await sharp(readFileSync(file)).rotate().toBuffer({ resolveWithObject: true })
  const { width, height } = upright.info
  const w = Math.min(width, Math.round(height * 0.8))
  const h = Math.min(height, Math.round(width * 1.25))
  return sharp(upright.data)
    .extract({ left: Math.floor((width - w) / 2), top: Math.floor((height - h) * 0.25), width: w, height: h })
    .flatten({ background: '#fff' })
    .resize(768, 960)
    .jpeg({ quality: 95 })
    .toBuffer()
}

for (const file of files) {
  try {
    const photo = await crop(join(photos, file))
    const input = await sharp(photo).resize(400, 500).jpeg({ quality: 95 }).toBuffer()
    const tiles = [await sharp(photo).resize(tile).toBuffer()]
    for (const [style, colour] of tests) {
      try {
        tiles.push(await sharp(await provider.edit(input, buildPrompt(style, colour))).resize(tile).toBuffer())
      } catch (e) {
        console.log(`  ${file} ${style}: ${e.message}`)
        tiles.push(await sharp({ create: { ...tile, channels: 3, background: '#ddd' } }).jpeg().toBuffer())
      }
    }
    const out = join(results, `${parse(file).name}.jpg`)
    await sharp({ create: { width: tile.width * 3, height: tile.height * 2, channels: 3, background: '#fff' } })
      .composite(tiles.map((input, i) => ({ input, left: (i % 3) * tile.width, top: Math.floor(i / 3) * tile.height })))
      .jpeg({ quality: 92 })
      .toFile(out)
    console.log(`  saved ${out}`)
  } catch (e) {
    console.log(`  ${file}: ${e.message}`)
  }
}
