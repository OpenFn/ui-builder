<script lang="ts">
  import { getContext } from 'svelte'
  import type ts from 'typescript'
  import type { AstContext } from '../types'
  import { getCallExpression } from '../utils'
  import StringInput from './stringInput.svelte'

  export let node: ts.Node
  let { getSymbolAtLocation } = getContext('ast') as AstContext

  $: callExpression = getCallExpression(node)
  $: symbol = getSymbolAtLocation(callExpression?.expression)
</script>

<div class="rounded bg-white border-solid border-2 border-blue">
  <div class="pl-2 pt-2">{callExpression.expression.escapedText}</div>
  <div class="flex flex-col rounded px-2 pb-2 space-y-2">
    <!-- using the type definition found, loop over the parameters
     and render the appropriate block. -->
    {#each symbol.valueDeclaration.parameters as arg, i}
      <StringInput
        node={callExpression.arguments[i]}
        name={arg.name.escapedText} 
        optional={Boolean(arg.questionToken)} />
    {/each}
  </div>
</div>
