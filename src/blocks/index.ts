import * as ts from 'typescript'
import ForLoop from './ForLoop.svelte'
import IfStatement from './IfStatement.svelte'
import SourceFile from './SourceFile.svelte'
export { default as Generic } from './Generic.svelte'
export { default as Node } from './Node.svelte'

/**
 * Default export shaped in the way BlockContext expects.
 * NOTE we don't export Generic or Node from here as they aren't considered
 * 'custom' blocks.
 */
export default [
  {
    component: SourceFile,
    matcher: ts.isSourceFile
  },
  {
    component: IfStatement,
    matcher: ts.isIfStatement
  },
  {
    component: ForLoop,
    matcher: ts.isForStatement
  }
]