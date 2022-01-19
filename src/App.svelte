<script lang="ts">
	import type ts from "typescript";
  import { code } from "./sourceFileStore";
  import Node from "./Node.svelte";
  import Editor from "./Editor.svelte";
  import { stringToSourceFile } from "./parser";

	let node: ts.Node;
	let codeString: string;

	code.subscribe(value => {
		console.log("code subscription");
		
		codeString = value;
		node = stringToSourceFile(codeString);
	});
</script>

<div class="container mx-auto pt-4">
  <div class="flex flex-row gap-2">
    <div class="basis-1/2 rounded border-2 border-slate-800 bg-slate-800">
			<Editor code={codeString} />
    </div>
    <div class="basis-1/2 rounded">
      <Node {node} />
    </div>
  </div>
</div>
