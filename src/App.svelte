<script lang="ts">
  export let code: string;
  import Node from "./Node.svelte";
  import { stringToSourceFile } from "./parser.ts";
  let node = stringToSourceFile(code);
</script>

<div class="container mx-auto pt-4">
  <div class="flex flex-row gap-2">
    <div class="basis-1/2 rounded border-2 border-slate-800 bg-slate-800">
      <div class="font-mono border-box p-2 pb-1 text-slate-100">
        {code}
      </div>
    </div>
    <div class="basis-1/2 rounded">
      <Node {node} />
    </div>
  </div>
</div>
