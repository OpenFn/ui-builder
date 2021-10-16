module.exports = {
	jit: true,
	content: ['./public/index.html', './src/**/*.{ts,svelte}'],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
}
