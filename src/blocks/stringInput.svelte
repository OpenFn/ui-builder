<script lang="ts">
  import { getContext } from 'svelte'
  import type ts from 'typescript'
  import type { AstContext } from '../types'
  export let node: ts.StringLiteralLike

  let { replaceString } = getContext('ast') as AstContext
</script>

<div class="block">
  <span class="text-gray-700">url</span>
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
    value={node.text}
    on:input={(e) => replaceString(node, e.target.value)} />
</div>
