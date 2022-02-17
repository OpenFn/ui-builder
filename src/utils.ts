/**
 * Utils
 *
 * A place to put stuff that has no logical grouping _yet_, the leftovers
 * should be library/use case agnostic.
 */

import type ts from 'typescript'
import type { IRange, ITextModel } from 'monaco-editor'

/**
 * Gets an IRange of a given Node, which can be used when sending edit operations
 * to an editor model.
 *
 * _NOTE_: Characters that have no signifcance to the AST (like trailing spaces)
 * are ignored.
 */
export function getNodeRange(node: ts.Node): IRange {
  const start = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
  const end = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getEnd())

  return {
    startLineNumber: start.line + 1,
    startColumn: start.character + 1,
    endLineNumber: end.line + 1,
    endColumn: end.character + 1
  }
}

/**
 * Replaces a section of the editor code using an AST node's postion.
 * The Node passed in should come from an AST that came from the same model code.
 */
export function replaceNode(model: ITextModel, node: ts.Node, text: string): void {
  model.pushEditOperations([], [{ range: getNodeRange(node), text }])
}
