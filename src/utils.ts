/**
 * Utils
 *
 * A place to put stuff that has no logical grouping _yet_, the leftovers
 * should be library/use case agnostic.
 */

import { getLineAndCharacterOfPosition } from 'typescript'
import type ts from 'typescript'
import type { IRange, editor } from 'monaco-editor'

/**
 * Gets an IRange of a given Node, which can be used when sending edit operations
 * to an editor model.
 *
 * _NOTE_: Characters that have no signifcance to the AST (like trailing spaces)
 * are ignored.
 */
export function getNodeRange(node: ts.Node): IRange {
  const start = getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
  const end = getLineAndCharacterOfPosition(node.getSourceFile(), node.getEnd())

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
 * 
 * This is the preferred way of changing the editor code as it maintains the
 * undo/redo stack.
 */
export function replaceNode(model: editor.ITextModel, node: ts.Node, text: string): void {
  // @ts-expect-error
  model.pushEditOperations([], [{ range: getNodeRange(node), text }])
}

export function replaceEditorValue(editor: editor.IStandaloneCodeEditor, value: string) {
  const model = editor.getModel()
  if (value != null && model != null && value !== model.getValue()) {
    editor.pushUndoStop()
    // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
    // @ts-expect-error
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: value
        }
      ]
    )
    editor.pushUndoStop()
  }
}
