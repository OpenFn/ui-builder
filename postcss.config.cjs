module.exports = (ctx) => ({
  map: {
    absolute: false,
    sourcesContent: ctx.env === 'development'
  },
  plugins: {
    tailwindcss: { config: './tailwind.config.cjs' },
    autoprefixer: {}
  }
})
