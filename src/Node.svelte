<script>
  import { getChildren, getType } from "./parser";

  export let node;

  let nodeType = getType(node);
  let shouldRender = nodeType != "EndOfFileToken";
  import SourceFile from "./SourceFile.svelte";
  import IfStatement from "./IfStatement.svelte";

  const nodeComponents = { SourceFile, IfStatement };
</script>

{#if shouldRender}
  {#if nodeType in nodeComponents}
    <svelte:component this={nodeComponents[nodeType]} {node} />
  {:else}
    <div class="rounded p-2 bg-blue-500/25">
      {getType(node)}
      <div class="flex flex-col rounded px-2 pb-2 space-y-2">
        {#each [...getChildren(node)] as node}
          <svelte:self {node} />
        {/each}
      </div>
    </div>
  {/if}
{/if}
