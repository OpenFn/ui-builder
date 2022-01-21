<script lang="ts">
  import { getChildren, getType } from './parser'
  import ts, { SyntaxKind } from 'typescript'

  export let node: ts.Node

  let kind = node.kind
  let nodeType: string = SyntaxKind[node.kind]
  $: {
    console.log(node.kind, kind, nodeType)
  }
  let shouldRender = nodeType != 'EndOfFileToken'
  import SourceFile from './SourceFile.svelte'
  import IfStatement from './IfStatement.svelte'

  const nodeComponents = { SourceFile, IfStatement }
</script>

{#if shouldRender}
  {#if nodeType in nodeComponents}
    <svelte:component this={nodeComponents[nodeType]} {node} />
  {:else}
    <div class="rounded p-2 bg-blue-500/25">
      <div class="flex gap-2 text-sm font-mono leading-6 bg-stripes-indigo rounded-lg">
        <div class="grow flex">
          {nodeType}
        </div>
        <div
          class="px-2 flex-none text-xs rounded-lg flex items-center justify-center text-neutral-800 hover:bg-slate-300/50">
          {node.getStart()}:{node.getEnd()}
        </div>
      </div>

      <div class="flex flex-col rounded px-2 pb-2 space-y-2">
        {#each [...getChildren(node)] as node}
          <svelte:self {node} />
        {/each}
      </div>
    </div>
  {/if}
{/if}
