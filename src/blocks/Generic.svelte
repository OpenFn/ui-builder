<script lang="ts">
  import { getContext } from 'svelte'
  import type ts from 'typescript'
  import { SyntaxKind } from 'typescript'
  import { getChildren } from '../parser'
  import type { BlockContext } from '../types'
  import { getNodeRange } from '../utils'
  import Node from './Node.svelte'

  let blockContext: BlockContext = getContext('blockContext')

  export let node: ts.Node

  $: nodeType = SyntaxKind[node.kind]
  $: nodeRange = getNodeRange(node)
</script>

<div class="rounded p-2 bg-blue-500/25">
  <div
    class="flex gap-2 text-sm font-mono leading-6 bg-stripes-indigo rounded-lg">
    <div class="grow flex">
      {nodeType}
    </div>
    <div
      class="px-2
             flex-none
             text-xs
             rounded-lg
             flex
             items-center
             justify-center
             text-neutral-800
             hover:bg-slate-300/50">
      {nodeRange.startLineNumber}:{nodeRange.startColumn}
    </div>
  </div>

  <div class="flex flex-col rounded px-2 pb-2 space-y-2">
    {#each [...getChildren(node)] as _node}
      <Node node={_node} />
    {/each}
  </div>
</div>
