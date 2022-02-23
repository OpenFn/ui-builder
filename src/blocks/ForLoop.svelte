<script context="module" lang="ts">
	import * as ts from 'typescript'

	export function resolver(node: ts.Node) {
		return ts.isForStatement(node)
	}
</script>

<script lang="ts">

</script>

<div></div>