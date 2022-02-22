<script lang="ts">
  import { onMount } from 'svelte'
  import type { EditorContext } from './types'

  export let editorContext: EditorContext
  let editorElement: HTMLElement

  onMount(() => {
    editorContext.setElem(editorElement)
  })

</script>

<div bind:this={editorElement} style="width: 100%; height: 100%" class="max-h-max" />
