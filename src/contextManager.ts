/**
 * ContextManager
 *
 * Singleton store for communicating between the code and block editors
 */

import { writable, readable, derived, get, Readable, Writable } from 'svelte/store'
import type monaco from 'monaco-editor'
import type ts from 'typescript'
import type { AstContext, AstContextOptions, EditorContext, EditorContextOptions } from './types'
import { debug } from 'svelte/internal'
import { stringToSourceFile } from './parser'
import { replaceNode, replaceEditorValue } from './utils'

interface CodeStore extends Readable<string> {
  set(this: void, value: string): void
}

export function createCodeStore(code: string): CodeStore {
  const { subscribe, set } = writable(code)

  return { subscribe, set }
}

export function createASTStore(codeStore: CodeStore) {
  const { subscribe } = derived(codeStore, ($code) => $code + 'imma ast')
  return { subscribe }
}

export type LibOption = [path: string, dts: string]
interface ContextOptions {
  code: string
  libs?: LibOption[]
  editorOptions?: monaco.editor.IStandaloneEditorConstructionOptions
}

export function createContext(options: ContextOptions) {
  const libs = writable(options.libs || [])
  const code = createCodeStore(options.code)
  // const editor = writable(
  // const editor = createEditorContext({editorDefaults, ...options.editorOptions})

  return { libs, code }
}

/**
 * Creates a new EditorContext, which will mount the editor as soon as it's
 * given an `elem` to mount to.
 *
 * @param {EditorContextOptions} opts
 * @param opts.code A string of sourcecode
 * @param opts.editorOptions Settings for Monaco Editor, the `value` property
 *   will be overwritten by the `code` value provided.
 * @param opts.elem Element to mount Monaco Editor onto, can be set immediately
 *   or later by calling `setElem` on the returned object.
 */
export function createEditorContext(opts: EditorContextOptions): EditorContext {
  const editor = writable<monaco.editor.IStandaloneCodeEditor | null>(null)
  const editorValue: Writable<string> = writable("");
  const elem: Writable<HTMLElement | null> = writable(opts.elem || null);

  function setElem(newElem: HTMLElement) {
    console.debug("setting EditorContext.elem as", newElem)
    elem.set(newElem)
  }

  elem.subscribe(($elem) => {
    if ($elem) {
      const _editor = opts.editorFactory($elem, { ...opts.editorOptions, value: opts.code })

      console.debug("setting onDidChangeModelContent callback")
      _editor.onDidChangeModelContent((event) => {
        console.debug("setting editorContent from onDidChangeModelContent")
        editorValue.set(_editor.getValue())
      })

      // Instead of waiting for a change in the editor, we set it immediately.
      console.debug("setting EditorContext.editorValue with initial value from editor")
      editorValue.set(_editor.getValue())
      editor.set(_editor)
    }
  })

  const model = derived(editor, ($editor) => {
    if ($editor) {
      console.debug("setting editorContent from derived model")
      editorValue.set($editor.getValue())
      return $editor.getModel()
    }
    return null
  }, null as monaco.editor.ITextModel | null)

  return {
    editor,
    elem,
    setElem,
    replaceNode: (node: ts.Node, text: string) => {
      const _model = get(model)
      if (_model) {
        replaceNode(_model, node, text)
      } else {
        throw new Error("Tried to replaceNode while model wasn't available.")
      }
    },
    replaceEditorValue: (text: string) => {
      const _editor = get(editor)
      if (_editor) {
        replaceEditorValue(_editor, text)
      } else {
        throw new Error("Tried to replaceEditorValue while editor wasn't available.")
      }
    },
    editorValue: { subscribe: editorValue.subscribe }
  }
}

/**
 * Creates a new AstContext, which reactively updates the AST when the code changes.
 * @param {AstContextOptions} opts
 * @param opts.code A store containing sourcecode used to
 *   update the AST.
 * @param opts.replaceNode Function to be used when an AST Node component wants 
 *   to update the editor.
 */
export function createAstContext({code, replaceNode}: AstContextOptions): AstContext {
  const sourceFile: Readable<ts.SourceFile | null> = derived(code, ($code) => {
    if ($code) {
      console.debug("Converting string to SourceFile")
      return stringToSourceFile($code)
    }

    return null
  }, null)

  return { sourceFile, replaceNode }
}