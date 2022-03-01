import * as ts from 'typescript'
import { getCallExpression } from '../utils'
import ForLoop from './ForLoop.svelte'
import IfStatement from './IfStatement.svelte'
import SourceFile from './SourceFile.svelte'
import CallExpression from './CallExpression.svelte'
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
  },
  {
    component: CallExpression,
    matcher: (n: ts.Node) => Boolean(getCallExpression(n))
  }
]

