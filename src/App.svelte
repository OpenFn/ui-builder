<script lang="ts">
  import { code } from './sourceFileStore'
  import Node from './Node.svelte'
  import Editor from './Editor.svelte'
  import { derived, Readable } from 'svelte/store'
  import type { State } from './sourceFileStore'

  export let compilerStore: Readable<State>

  /* $: compiler = $compilerStore.compiler */
  let sourceFile = derived(compilerStore, ($compilerStore) => {
    return $compilerStore.compiler?.program.getSourceFile('index.ts') 
  })

  let sourceFileText = derived(sourceFile, ($sourceFile) => {
    return $sourceFile?.text || ""
  })

  $: {
    console.log({ $compilerStore })
  }

  let editorChange = function (value, event) {
    code.update((current: string) => {
      return event.changes.reduce((acc: string, change) => {
        // TODO: move this to helper module
        let { rangeLength, rangeOffset, text } = change
        console.log([
          acc.slice(0, rangeOffset),
          text,
          acc.slice(rangeOffset + rangeLength, acc.length)
        ])
        return `${acc.slice(0, rangeOffset)}${text}${acc.slice(
          rangeOffset + rangeLength,
          acc.length
        )}`
      }, current)
    })
  }
</script>

<div class="flex flex-row gap-2">
  {#if $compilerStore.ready}
    {(console.log("ready", $compilerStore.compiler), '')}
    <div
      class="basis-1/2 rounded border-2 border-slate-800 bg-slate-800 sticky h-[97vh] top-0 max-h-max">
      <Editor code={$sourceFileText} onChange={editorChange} />
    </div>
    <div class="basis-1/2 rounded">
      <Node node={$sourceFile} />
    </div>
  {:else}Not Ready{/if}
</div>
