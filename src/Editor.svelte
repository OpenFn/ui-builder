<script lang="ts">
  // import { create } from 'monaco-editor/esm/vs/language/typescript/ts.worker'
  import type monaco from 'monaco-editor'
  import { onMount } from 'svelte'
  import { createEditor, addExtraLib, replaceEditorValue } from './editorSetup'

  export let code: string
  export let onChange: (value: string, event: monaco.editor.IModelContentChangedEvent) => void
  let editorElement: HTMLElement
  let editor: undefined | monaco.editor.IStandaloneCodeEditor
  let mustTriggerChange = true

  $: {
    console.log(code)
  }
  onMount(() => {
    editor = createEditor(editorElement, {
      value: code,
      language: 'javascript',
      lineNumbers: 'on',
      roundedSelection: true,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: 'vs-dark',
      minimap: { enabled: false }
    })

    // Example on adding a language pack's dts */
    // import languageCommonDts from '../public/build/types/index.d.ts'
    // addExtraLib(languageCommonDts, 'ts:language-common/index.d.ts')

    editor.onDidChangeModelContent((event) => {
      if (mustTriggerChange) {
        editor && onChange(editor.getValue(), event)
      }
    })
  })

  $: {
    mustTriggerChange = false
    if (editor) {
      console.log('replacing editor value', code)

      replaceEditorValue(editor, code)
    }
    mustTriggerChange = true
  }
</script>

<div bind:this={editorElement} style="width: 100%; height: 100%" class="max-h-max" />
