import * as monaco from 'monaco-editor'

export function createEditor(
  elem: HTMLElement,
  opts: monaco.editor.IStandaloneEditorConstructionOptions
): monaco.editor.IStandaloneCodeEditor {
  self.MonacoEnvironment = {
    getWorkerUrl() {
      // TODO: this shouldn't be so static...
      // see: https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-esbuild
      // for inspiration
      // return './build/tsworker.js'
      return new URL('ts.worker.js', import.meta.url)
    }
  }

  return monaco.editor.create(elem, opts)
}

export function replaceEditorValue(editor: monaco.editor.IStandaloneCodeEditor, value: string) {
  const model = editor.getModel()
  if (value != null && model != null && value !== model.getValue()) {
    editor.pushUndoStop()
    // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
    // @ts-expect-error
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: value
        }
      ]
    )
    editor.pushUndoStop()
  }
}
