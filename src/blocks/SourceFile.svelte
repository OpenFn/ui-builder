<script context="module" lang="ts">
	import * as ts from 'typescript'

	export function resolver(node: ts.Node) {
		return ts.isSourceFile(node)
	}
</script>

<script lang="ts">
  import { getChildren } from '../parser'
  import Node from './Node.svelte'

  export let node: ts.SourceFile
</script>

<div class="rounded bg-white border-dashed border-2 border-blue">
  <div class="flex flex-col rounded p-2 space-y-2">
    {#each [...getChildren(node)] as _node}
      <Node node={_node} />
    {/each}
  </div>
</div>
