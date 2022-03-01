<script lang="ts">
  import { getContext } from 'svelte'
  import type ts from 'typescript'
  import type { BlockContext } from '../types'

  let blockContext: BlockContext = getContext('blockContext')

  export let node: ts.Node

  $: component = blockContext.getBlockForNode(node)
</script>

{#if component}
  <div class="my-2">
    <svelte:component this={component} {node} />
  </div>
{/if}
