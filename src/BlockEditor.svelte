<script lang="ts">
  import { setContext } from 'svelte'
  import type { AstContext, BlockContext } from './types'
  import Node from './blocks/Node.svelte'
  import { get } from 'svelte/store'

  export let astContext: AstContext
  export let blockContext: BlockContext

  setContext('ast', astContext)
  setContext('blockContext', blockContext)
  let { sourceFile } = astContext

  function addIfStatement() {
    const statement = astContext.textFactory((factory) =>
      factory.createIfStatement(
        factory.createFalse(),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createIdentifier('alert'),
                undefined,
                [factory.createStringLiteral('wat?!')]
              )
            )
          ],
          false
        ),
        undefined
      )
    )

    astContext.insertAfterNode(get(sourceFile), '\n\n' + statement)
  }
</script>

{#if $sourceFile}
  <div class="rounded bg-white border-dashed border-2 border-blue">
    <div class="flex flex-col rounded p-2 space-y-2">
      <Node node={$sourceFile} />
      <div class="border-t-2 border-slate-200 pt-2 mt-2">
        <button
          on:click={addIfStatement}
          class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
          >+ IfStatement</button>
      </div>
    </div>
  </div>
{:else}
  <h2>No SourceFile</h2>
{/if}
