module.exports = (ctx) => ({
  map: {
    absolute: false,
    sourcesContent: ctx.env === 'development'
  },
  plugins: {
    autoprefixer: {},
    tailwindcss: { config: './tailwind.config.cjs' }
  }
})
