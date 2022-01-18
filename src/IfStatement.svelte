<script lang="ts">
  import type ts from 'typescript'
  import { getChildren, printNode } from './parser'
  import Node from './Node.svelte'

  export let node: ts.IfStatement
  let expressionText = printNode(node.expression)
</script>

<div class="rounded bg-white border-solid border-2 border-blue">
  <div class="pl-2 pt-2">IfStatement</div>
  <div class="flex flex-col rounded px-2 pb-2 space-y-2">
    <label class="block">
      <span class="text-gray-700">Expression</span>
      <input
        type="text"
        class="mt-1
							 font-mono
               block
               w-full
               rounded-md
               bg-gray-100
               border-transparent
               focus:border-gray-500 focus:bg-white focus:ring-0"
        placeholder=""
        bind:value={expressionText} />
    </label>
    <Node node={node.expression} />
    {#each [...getChildren(node)] as node}
      <Node {node} />
    {/each}
  </div>
</div>
