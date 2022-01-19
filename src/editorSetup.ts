import * as monaco from 'monaco-editor'

export function createEditor(
  elem: HTMLElement,
  opts: monaco.editor.IStandaloneEditorConstructionOptions
) {
  this.MonacoEnvironment = {
    getWorkerUrl() {
			// TODO: this shouldn't be so static...
			// see: https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-esbuild
			// for inspiration
      return './build/tsworker.js'
    }
  }

  monaco.editor.create(elem, opts)
}
