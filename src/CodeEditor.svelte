<script lang="ts">
  // import { create } from 'monaco-editor/esm/vs/language/typescript/ts.worker'
  import type monaco from 'monaco-editor'
  import { onMount } from 'svelte'
  import { createEditorContext } from './contextManager'
  import { createEditor, addExtraLib, replaceEditorValue } from './editorSetup'
  import type { EditorContext } from './types'

  export let editorContext: EditorContext
  let editorElement: HTMLElement
  // let mustTriggerChange = true

  onMount(() => {
    editorContext.setElem(editorElement)
  })

  $: {
    /* mustTriggerChange = false */
    /* if (editor) { */
    /*   console.log('replacing editor value', code) */
    /*   replaceEditorValue(editor, code) */
    /* } */
    /* mustTriggerChange = true */
  }
</script>

<div bind:this={editorElement} style="width: 100%; height: 100%" class="max-h-max" />
