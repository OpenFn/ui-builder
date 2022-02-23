import type { Readable } from 'svelte/store'
import type ts from 'typescript'
import type monaco from 'monaco-editor'
interface CodeStore extends Readable<string> {
  set(this: void, value: string): void
}

export interface EditorFactory {
  (
    elem: HTMLElement,
    opts: monaco.editor.IStandaloneEditorConstructionOptions
  ): monaco.editor.IStandaloneCodeEditor
}

export interface EditorContextOptions {
  code: string;
  elem?: HTMLElement;
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions;
  editorFactory: EditorFactory
}

export interface EditorContext {
  editor: Readable<monaco.editor.IStandaloneCodeEditor | null>;
  elem: Readable<HTMLElement | null>;
  /**
   * Set the element to mount Monaco Editor onto.
   * @param elem 
   */
  setElem: (elem: HTMLElement) => void;
  replaceNode: (node: ts.Node, text: string) => void;
  replaceEditorValue: (text: string) => void;
  editorValue: Readable<string>;
}

export interface AstContextOptions {
  code: Readable<string>;
  /**
   * Function to replace a given node's text.
   * 
   * This will usually be created with the editor model bound inside it.
   * For example `EditorContext.replaceNode` can be passed directly in here.
   */
  replaceNode: (node: ts.Node, text: string) => void;
}

export interface AstContext {
  /**
   * Readable store containing the SourceFile object of the main model.
   */
  sourceFile: Readable<ts.SourceFile | null>;
  replaceNode: (node: ts.Node, text: string) => void;
}


// Blocks and Resolvers

export interface BlockResolver {
	(node: ts.Node): boolean;
}