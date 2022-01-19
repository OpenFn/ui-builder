<script lang="ts">
  // import { create } from 'monaco-editor/esm/vs/language/typescript/ts.worker'
  import { onMount } from 'svelte'
  import { createEditor } from './editorSetup'

	export let code: string;
  let editorElement: HTMLElement;

  onMount(() => {
    createEditor(editorElement, {
			value: code,
      language: 'javascript',
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: 'vs-dark',
      minimap: { enabled: false }
    })
  })
</script>

<div bind:this={editorElement} style="width: 100%; height:100%" />
