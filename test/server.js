import express from 'express'
import path from 'path'

// Turns input into an array if not one already
function normalizeArray(arr) {
  return Array.isArray(arr) ? arr : [arr]
}

// Optionally, just get the Javascript paths from specific chunks
function getJsPathsFromChunks(webpackJson, chunkNames) {
  const { assetsByChunkName } = webpackJson
  chunkNames = normalizeArray(chunkNames)
  return chunkNames.reduce((paths, name) => {
    if (assetsByChunkName[name] != null) {
      for (let asset of normalizeArray(assetsByChunkName[name])) {
        if (asset != null && asset.endsWith('.js')) {
          paths.push(asset)
        }
      }
    }
    return paths
  }, [])
}

let port = 4444
const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
if (index !== -1) {
  port = +process.argv[index + 1] || port
}

var options = {
  dotfiles: 'ignore',
  etag: false,
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

const root = path.resolve(path.dirname(import.meta.url.replace(/^file:\/\//, '')), '../')

express()
  .use(express.static(root, options))
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`)
    console.log(`Serving from ${root}`)
  })
