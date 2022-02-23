import Layout from './Layout.svelte'
import { createAstContext, createEditorContext } from './contextManager'
import { createEditor } from './editorSetup'
import './main.css'
import type { BlockContext, Block, BlockFromImport } from './types'
import * as blocks from './blocks'

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
    replaceNode: editorContext.replaceNode
  })

  console.log(blocks)
  console.log(Object.keys(blocks))

  function createBlockContext(blocks: { [x: string]: Block }): BlockContext {
    function getBlockForNode(node: ts.Node) {
      for (const key in blocks) {
        if (Object.prototype.hasOwnProperty.call(blocks, key)) {
          const block: Block = blocks[key];
          if (block.resolver && block.resolver(node)) {
            return block.default;
          }
        }
      }
    }

    return {
      blocks,
      getBlockForNode
    }
  }
  let blockContext = createBlockContext(blocks)

  const app = new Layout({
    target: elem,
    props: { editorContext, astContext, blockContext }
  })
  return app
}
