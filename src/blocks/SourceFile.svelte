<script lang="ts">
  import type { SourceFile } from 'typescript'
  import { getChildren } from '../parser'
  import Node from './Node.svelte'

  export let node: SourceFile
</script>

<div class="rounded bg-white border-dashed border-2 border-blue p-2 space-y-2">
  <span class="font-mono">{node.fileName}</span>
  <div class="flex flex-col rounded">
    {#each [...getChildren(node)] as _node}
      <Node node={_node} />
    {/each}
  </div>
</div>
