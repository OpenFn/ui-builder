<script lang="ts">
  import { setContext } from 'svelte'
  import type { AstContext, BlockContext } from './types'
  import Node from './blocks/Node.svelte'

  export let astContext: AstContext
  export let blockContext: BlockContext

  setContext('ast', astContext)
  setContext('blockContext', blockContext)
  let { sourceFile } = astContext
</script>

{#if $sourceFile}
  <Node node={$sourceFile} />
{:else}
  <h2>No SourceFile</h2>
{/if}
