describe('Google', () => {
  beforeAll(async () => {
    await page.goto(PATH + '/test/index.html', { waitUntil: 'load' })
  })

  it('should be titled "Svelte app"', async () => {
    await expect(page.title()).resolves.toMatch('Svelte app')
  })
})
