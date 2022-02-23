<script lang="ts">
  import { getContext } from 'svelte'
  import type ts from 'typescript'
  import type { AstContext } from '../types'
  import Node from './Node.svelte'

  export let node: ts.IfStatement
  $: expression = node.expression
  $: expressionText = expression.getFullText()

  let { replaceNode } = getContext('ast') as AstContext
</script>

<div class="rounded bg-white border-solid border-2 border-blue">
  <div class="pl-2 pt-2">IfStatement</div>
  <div class="flex flex-col rounded px-2 pb-2 space-y-2">
    <div class="block">
      <span class="text-gray-700">condition</span>
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
        value={expressionText}
        on:input={(e) => replaceNode(expression, e.target.value)} />
    </div>
    {#if node.thenStatement}
      <div class="block">
        <span class="text-gray-700">then</span>
        <Node node={node.thenStatement} />
      </div>
    {/if}
    {#if node.elseStatement}
      <div class="block">
        <span class="text-gray-700">else</span>
        <Node node={node.elseStatement} />
      </div>
    {/if}
  </div>
</div>
