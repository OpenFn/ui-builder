import Layout from './Layout.svelte';
import { createAstContext, createEditorContext } from './contextManager';
import { createEditor } from './editorSetup';
import './main.css';

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

	window.editorContext = editorContext;

  let astContext = createAstContext({
    code: editorContext.editorValue,
    replaceNode: editorContext.replaceNode
  })

  const app = new Layout({ target: elem, props: { initialCode, editorContext, astContext } })
  return app
}
