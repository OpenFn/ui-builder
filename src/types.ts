import type monaco from 'monaco-editor'
import type { SvelteComponent, SvelteComponentDev } from 'svelte/internal'
import type { Readable } from 'svelte/store'
import type ts from 'typescript'

export interface EditorFactory {
  (
    elem: HTMLElement,
    opts: monaco.editor.IStandaloneEditorConstructionOptions
  ): monaco.editor.IStandaloneCodeEditor
}

export interface EditorContextOptions {
  code: string
  elem?: HTMLElement
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions
  editorFactory: EditorFactory
}

export interface EditorContext {
  editor: Readable<monaco.editor.IStandaloneCodeEditor | null>
  elem: Readable<HTMLElement | null>
  /**
   * Set the element to mount Monaco Editor onto.
   * @param elem
   */
  setElem: (elem: HTMLElement) => void
  replaceEditorValue: (text: string) => void
  editorValue: Readable<string>
  model: Readable<monaco.editor.ITextModel | null>
}

export interface AstContextOptions {
  code: Readable<string>
  model: Readable<monaco.editor.ITextModel | null>
}

export interface AstContext {
  /**
   * Readable store containing the SourceFile object of the main model.
   */
  sourceFile: Readable<ts.SourceFile | null>
  /**
   * Function to replace a given node's text.
   *
   * This will usually be created with the editor model bound inside it.
   * For example `EditorContext.replaceNode` can be passed directly in here.
   */
  replaceNode: (node: ts.Node, text: string | ts.Node) => void
  replaceString: (node: ts.StringLiteralLike, text: string) => void
  insertAfterNode: (node: ts.Node, text: string | ts.Node) => void
  textFactory: (builder: (factory: ts.NodeFactory) => ts.Node) => string
}

// Blocks and Resolvers
export interface NodeMatchFunction {
  (node: ts.Node): boolean
}

export type NodeMatcher = NodeMatchFunction | string

export interface Block {
  matcher: NodeMatcher
  component: ConstructorOfATypedSvelteComponent
}

// TODO: We _shouldn't_ be relying on ConstructorOfATypedSvelteComponent
// is there something else we can use or an internal type that is compatible?
export interface BlockContext {
  blocks: Block[]
  getBlockForNode: (node: ts.Node) => null | ConstructorOfATypedSvelteComponent
  fallback: ConstructorOfATypedSvelteComponent
  allowFilter: NodeMatchFunction
}
