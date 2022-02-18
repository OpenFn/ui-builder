// This is broken right now because Jest Puppeteer when mixing Typescript is
// giving me hassles.
// Set up puppeteer _without_ jest puppeteer using the examples below:
// https://jestjs.io/docs/puppeteer#custom-example-without-jest-puppeteer-preset
describe('Browser', () => {
  // beforeAll(async () => {
  //   await page.goto(PATH + '/test/index.html', { waitUntil: 'load' })
  // })
  it('should be titled "Svelte app"', async () => {
    // await expect(page.title()).resolves.toMatch('Svelte app')
  })
})
