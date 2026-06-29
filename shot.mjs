import { chromium } from 'playwright'

const OUT = process.argv[2] || '.'
const BASE = 'http://localhost:8090'

const browser = await chromium.launch()

async function shot(name, { width, height, dark = false, full = false, path = '/', cookies = true }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  if (dark) {
    await ctx.addInitScript(() => localStorage.setItem('etan-tema', 'oscuro'))
  }
  if (cookies) {
    await ctx.addInitScript(() => localStorage.setItem('etan-cookies', 'aceptadas'))
  }
  const page = await ctx.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
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

await shot('obras', { width: 1440, height: 900, full: true, path: '/obras' })
await shot('maquinaria', { width: 1440, height: 900, full: true, path: '/maquinaria' })
await shot('presupuesto', { width: 1440, height: 900, full: true, path: '/presupuesto' })
await shot('empleo', { width: 1440, height: 900, full: true, path: '/empleo' })
await shot('nosotros', { width: 1440, height: 900, full: true, path: '/nosotros' })
await shot('contacto', { width: 1440, height: 900, full: true, path: '/contacto' })
await shot('legal', { width: 1440, height: 900, full: true, path: '/legal' })
await shot('mobile-maquinaria', { width: 390, height: 844, full: true, path: '/maquinaria' })
await shot('mobile-presupuesto', { width: 390, height: 844, full: true, path: '/presupuesto' })
await shot('cookies-banner', { width: 1440, height: 900, cookies: false })

await browser.close()
