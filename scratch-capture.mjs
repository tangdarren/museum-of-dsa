import { chromium } from 'playwright-core'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'

const URL = 'http://localhost:5174/'
const OUT = 'scratch-shots'
const W = Number(process.env.W ?? 1440)
const H = Number(process.env.H ?? 820)
const TAG = process.env.TAG ?? ''
const HALL = process.env.HALL ?? 'data-structures'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const BASE_FOV = 46
const MIN_FRAMED_ASPECT = 1.78
const MAX_FOV = 70

function framedFov(aspect) {
  if (aspect >= MIN_FRAMED_ASPECT) return BASE_FOV
  const halfHeight =
    Math.tan(MathUtils.degToRad(BASE_FOV) / 2) * (MIN_FRAMED_ASPECT / aspect)
  return Math.min(MAX_FOV, MathUtils.radToDeg(2 * Math.atan(halfHeight)))
}

function doorSign(x) {
  const camera = new PerspectiveCamera(framedFov(W / H), W / H, 0.1, 200)
  camera.position.set(0, 3.35, -20)
  camera.lookAt(new Vector3(0, 2.7, -46))
  camera.updateMatrixWorld(true)
  const v = new Vector3(x, 5.15, -31.8).project(camera)
  return { x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H }
}

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle'],
})
const page = await browser.newPage({ viewport: { width: W, height: H } })
const shot = (name) => page.screenshot({ path: `${OUT}/${TAG}${name}.png` })

async function overflow(label, selector) {
  const el = page.locator(selector).first()
  if (!(await el.count())) return console.log(`  ${label}: absent`)
  console.log(
    `  ${label}: ` +
      (await el.evaluate((node) => {
        const r = node.getBoundingClientRect()
        return `x ${Math.round(r.left)}..${Math.round(r.right)}, y ${Math.round(r.top)}..${Math.round(r.bottom)}, hidden ${node.scrollHeight - Math.round(r.height)}px`
      })),
  )
}

console.log(`${HALL} @ ${W}x${H} (aspect ${(W / H).toFixed(2)})`)

await page.goto(URL, { waitUntil: 'load' })
await sleep(3500)
await page.locator('button', { hasText: /enter/i }).first().click({ force: true })
await sleep(3500)

const sign = doorSign(HALL === 'algorithms' ? 5.6 : -5.6)
await page.mouse.click(sign.x, sign.y)
await sleep(4500)
await shot('overview')

await page.locator('.choose-algorithm-button').first().click({ force: true })
await sleep(2500)
await shot('selector')
await overflow('selector', '.algorithm-selector')

// Section headings now travel to that category's wall gallery.
const gallery = HALL === 'algorithms' ? 'Sorting' : 'Hash Table'
await page.locator('.algorithm-selector-gallery', { hasText: gallery }).first().click()
await sleep(5000)
await shot('gallery')
await overflow('gallery ui', '.algorithm-gallery-ui')

await page.getByRole('button', { name: 'Insert', exact: true }).first().click({ force: true }).catch(async () => {
  await page.locator('.algorithm-gallery-option, .algorithm-option').first().click({ force: true })
})
await sleep(5000)
await shot('focus')
await overflow('playback', '.algorithm-playback')
await overflow('plaque', '.algorithm-plaque')
await overflow('side', '.hash-table-side')

await browser.close()
