import blocks from './blocks'
import Generic from './blocks/Generic.svelte'
import {
  createAstContext,
  createBlockContext,
  createEditorContext
} from './contextManager'
import { createEditor } from './editorSetup'
import Layout from './Layout.svelte'
import './main.css'
import { getType } from './parser'

export function Builder(elem: HTMLElement, initialCode: string): Layout {
  let editorContext = createEditorContext({
    code: initialCode,
    editorFactory: createEditor,
    editorOptions: {
      language: 'javascript',
      lineNumbers: 'on',
      roundedSelection: true,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: 'vs-dark',
      minimap: { enabled: false }
    }
  })

  let astContext = createAstContext({
    code: editorContext.editorValue,
    model: editorContext.model
  })

  let blockContext = createBlockContext(blocks, Generic, (node) => {
    return getType(node) !== 'EndOfFileToken'
  })

  const app = new Layout({
    target: elem,
    props: { editorContext, astContext, blockContext }
  })

  return app
}
