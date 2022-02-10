import { writable, derived, get, Readable, readable } from 'svelte/store'
import { stringToCompiler, stringToSourceFile } from './parser'
import type ts from 'typescript'
import { assembleCompiler, BaseCompiler } from './compiler'

export type State = {
  ready: boolean
  compiler: BaseCompiler | null
}

function initialState(): State {
  return {
    ready: false,
    compiler: null
  }
}
function unsubscribe() {
  // nothing to do here yet..
}

async function initializeCompiler(state: State, code: string, set) {
  const compiler = await assembleCompiler(code)
  state.compiler = compiler
  state.ready = true
  set(state)
}

export function createCompilerStore(initialCode: string): Readable<State> {
  let initial = initialState()
  let store = readable(initial, (set) => {
    initializeCompiler(initial, initialCode, set)
    return unsubscribe
  })

  return store
}

export const code = writable('')
export const compiler = derived(code, async ($code, set): void => {
  const compiler = await assembleCompiler($code)

  console.debug(compiler.getDiagnostics())
  set(compiler)
})

export const sourceFile = derived(compiler, ($compiler): ts.SourceFile => {
  if ($compiler) {
    const sourceFile = $compiler.program.getSourceFile('index.ts')
    console.log(sourceFile)
    return sourceFile
  }
})

export const sourceFileText = derived(sourceFile, ($sourceFile) => {
  return $sourceFile?.text
})

export function replaceNodeText(node, content: string) {
  return code.update((codeString: string) => {
    const start = node.getFullStart()
    const end = start + node.getFullWidth()

    console.log({ start, end })

    console.log([codeString.slice(0, start), content, codeString.slice(end, codeString.length)], {
      start,
      end,
      content,
      codeString
    })
    const newCodeString: string = `${codeString.slice(0, start)}${content}${codeString.slice(
      end,
      codeString.length
    )}`

    console.log('updating code', { content, newCodeString })
    return newCodeString
  })
}
