import * as ts from 'typescript'

window.ts = ts

/**
 * Generates a nested data structure representing parent and their child nodes
 * for a given node/ast.
 *
 * `[Kind, [Child, ...]]`
 */
export function generateTree(node: ts.Node, acc: string[][] = []) {
  const parent: string = ts.SyntaxKind[node.kind]
  const children: string[][] = []

  ts.forEachChild(node, (node: ts.Node) => {
    generateTree(node, children)
  })
  acc.push([parent, children])

  return acc
}

export function stringToSourceFile(code: string): ts.SourceFile {
  // ES2020 being the script target
  // true being to `setParentNodes` important for rendering
  // the text of a node (where the printer need the SourceFile for context)
  return ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ES2020, true, ts.ScriptKind.JS)
}

export function getType(node: ts.Node): string {
  return ts.SyntaxKind[node.kind]
}

export function* getChildren(node: ts.Node) {
  const children: ts.Node[] = []

  ts.forEachChild(node, (child) => {
    children.push(child)
  })

  yield* children
}

export function printNode(node: ts.Node): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  return printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile())
}

