<script lang="ts">
  import type ts from 'typescript'
  import { getChildren, printNode } from './parser'
  import { replaceNodeText } from './sourceFileStore'
  import Node from './Node.svelte'
import { isLabeledStatement } from 'typescript'

  export let node: ts.IfStatement
	$: expression = node.expression;
  $: expressionText = expression.getFullText()
  $: expressionStart = expression.getStart()
  $: expressionEnd = expression.getFullWidth()
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
        on:input={(e) => replaceNodeText(expression, e.target.value)} />
    </div>
		{#if node.thenStatement}
			<div class="block">
				<span class="text-gray-700">then</span>
				<Node node={node.thenStatement} />
			</div>
		{/if}
		{#if node.elseStatement}
			<Node node={node.elseStatement} />
		{/if}
  </div>
</div>
