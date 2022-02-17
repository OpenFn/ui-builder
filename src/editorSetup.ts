import * as monaco from 'monaco-editor'
import languageCommonDts from '../public/build/types/index.d.ts'

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

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  })

  return monaco.editor.create(elem, opts)
}

/**
 * Add an extra library to Monaco, allowing for resolving definitions and references.
 *
 * When resolving definitions and references, the editor will try to use created models.
 * Creating a model for the library allows "peek definition/references" commands
 * to work with the library.
 */
export function addExtraLib(dts: string, libUri: string): void {
  monaco.editor.createModel(dts, 'typescript', monaco.Uri.parse(libUri))
  monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, libUri)
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
