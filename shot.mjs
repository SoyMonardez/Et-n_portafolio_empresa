import { chromium } from 'playwright'

const OUT = process.argv[2] || '.'
const URL = 'http://localhost:8090/'

const browser = await chromium.launch()

async function shot(name, { width, height, dark = false, full = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  if (dark) {
    await ctx.addInitScript(() => localStorage.setItem('etan-tema', 'oscuro'))
  }
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  if (full) {
    // Scrollear de a poco para disparar las animaciones de aparición.
    await page.evaluate(async () => {
      const paso = window.innerHeight * 0.6
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 250))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 400))
    })
  }
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
  await ctx.close()
  console.log('ok', name)
}

await shot('desktop-hero', { width: 1440, height: 900 })
await shot('desktop-full', { width: 1440, height: 900, full: true })
await shot('mobile-hero', { width: 390, height: 844 })
await shot('desktop-dark', { width: 1440, height: 900, dark: true })

await browser.close()
