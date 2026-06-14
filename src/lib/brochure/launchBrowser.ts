import type { Browser } from "puppeteer-core"

const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_PACK_URL ??
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"

export async function launchBrowser(): Promise<Browser> {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL

  if (isProd) {
    const chromium = (await import("@sparticuz/chromium-min")).default
    const puppeteer = await import("puppeteer-core")
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: true,
    }) as unknown as Browser
  }

  const puppeteer = await import("puppeteer")
  return puppeteer.default.launch({
    headless: true,
    defaultViewport: { width: 1240, height: 1754 },
  }) as unknown as Browser
}
