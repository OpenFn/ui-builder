import { build } from 'esbuild'
import sveltePreprocess from 'svelte-preprocess'
import sveltePlugin from 'esbuild-svelte' // esbuild plugin svelte
import postcss from 'esbuild-postcss'
import liveserver from 'live-server' // dev server

function showUsage() {
  console.log('USAGE')
  console.log('node esbuild.js watch') // build and serve dev files
  console.log('node esbuild.js dev') // build dev files
  console.log('node esbuild.js prod') // build for production
  process.exit(0)
}

if (process.argv.length < 3) {
  showUsage()
}

if (!['dev', 'watch', 'prod'].includes(process.argv[2])) {
  showUsage()
}

// production mode, or not
const production = process.argv[2] === 'prod'

// esbuild watch in dev mode to rebuild out files
let watch = false
if (process.argv[2] === 'watch') {
  watch = {
    onRebuild(error) {
      if (error) console.error('esbuild: Watch build failed:', error.getMessage())
      else console.log('esbuild: Watch build succeeded')
    }
  }
  liveserver.start({
    port: 8080, // Set the server port. Defaults to 8080.
    root: './public', // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
  })
}

const commonBuildOptions = {
  bundle: true,
  write: true,
  watch,
  format: 'esm',
  target: 'esnext',
  outdir: './public/build',
  legalComments: 'none',
  ...(production
    ? { outdir: './dist', minify: true, pure: ['console.log', 'console.time', 'console.timeEnd'] }
    : {})
}

/**
 * Component modules
 */
build({
  ...commonBuildOptions,
  entryPoints: {
    main: './src/main.ts',
    'monaco-editor': 'monaco-editor'
  },
  plugins: [
    sveltePlugin({ preprocess: sveltePreprocess(), compileOptions: { dev: true } }),
    postcss()
  ],
  loader: { '.ttf': 'file' }
}).catch((err) => {
  console.error(err)
  process.exit(1)
})

/**
 * WebWorker modules
 * Need to be built using 'iife' since Firefox does not support ESM modules
 * in Workers just yet.
 */
build({
  ...commonBuildOptions,
  entryPoints: {
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker'
  },
  format: 'iife'
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
