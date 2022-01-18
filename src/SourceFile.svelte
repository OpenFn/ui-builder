<script>
  export let node;

  import { getChildren, getType } from "./parser";
  import Node from "./Node.svelte";
</script>

<div class="rounded bg-white border-dashed border-2 border-blue">
  <div class="flex flex-col rounded p-2 space-y-2">
    {#each [...getChildren(node)] as node}
      <Node {node} />
    {/each}
  </div>
</div>
