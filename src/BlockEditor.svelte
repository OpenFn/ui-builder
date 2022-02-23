<script lang="ts">
  import { setContext } from 'svelte'
  import type { AstContext } from './types'
  import Node from './blocks/Node.svelte'

  export let astContext: AstContext

  setContext('ast', astContext)
  let { sourceFile } = astContext
</script>

{#if $sourceFile}
  <Node node={$sourceFile} />
{:else}
  <h2>No SourceFile</h2>
{/if}
