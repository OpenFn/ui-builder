import * as monaco from 'monaco-editor'

/**
 * Creates a new MonacoEditor.
 *
 * This is where the webworker modules are loaded. ESM modules are used, and
 * have their own entrypoints in the build configuration: see `esbuild.js` for
 * the mappings between `*.worker.js` and the modules from Monaco.
 */
export function createEditor(
  elem: HTMLElement,
  opts: monaco.editor.IStandaloneEditorConstructionOptions
): monaco.editor.IStandaloneCodeEditor {
  self.MonacoEnvironment = {
    getWorker(_workerId: string, label: string): Worker {
      switch (label) {
        case 'typescript':
        case 'javascript':
          return new Worker(new URL('ts.worker.js', import.meta.url), {
            name: 'ts.worker',
            type: 'module'
          })

        case 'editorWorkerService':
          return new Worker(new URL('editor.worker.js', import.meta.url), {
            name: 'editor.worker',
            type: 'module'
          })
        default:
          throw new Error(`MonacoEnvironment.getWorker requested an unsupported worker: ${label}`)
      }
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
