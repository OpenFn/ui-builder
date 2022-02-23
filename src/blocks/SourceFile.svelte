<script>
  import { getChildren } from '../parser'
  import Node from './Node.svelte'

  export let node
</script>

<div class="rounded bg-white border-dashed border-2 border-blue">
  <div class="flex flex-col rounded p-2 space-y-2">
    {#each [...getChildren(node)] as node}
      <Node {node} />
    {/each}
  </div>
</div>
