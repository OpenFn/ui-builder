<script lang="ts">
  import CodeEditor from './CodeEditor.svelte'
  import BlockEditor from './BlockEditor.svelte'
  import type { AstContext, EditorContext, BlockContext } from './types'

  export let editorContext: EditorContext
  export let astContext: AstContext
  export let blockContext: BlockContext
</script>

<div class="flex flex-row gap-2">
  <div
    class="basis-1/2 rounded border-2 border-slate-800 bg-slate-800 sticky h-[97vh] top-0 max-h-max">
    <CodeEditor {editorContext} />
  </div>

  <div class="basis-1/2 rounded">
    <BlockEditor {astContext} {blockContext} />
  </div>
</div>
