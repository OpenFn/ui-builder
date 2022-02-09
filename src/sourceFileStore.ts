import { writable, derived, get, Readable } from 'svelte/store'
import { stringToSourceFile } from './parser'
import type ts from 'typescript'

export const code = writable('')
export const sourceFile = derived(code, ($code): ts.SourceFile => {
  // TODO figure out if it's possible to update the SourceFile instead of replacing it
  // currently getting errors from .update when an expression has spaces in it
  // const prev: ts.SourceFile | null = get(sourceFile)

  // if (prev) {
  //   try {
  //     prev.update($code, {
  //       newLength: $code.length,
  //       span: {
  //         start: 0,
  //         length: prev.text.length
  //       }
  //     })
  //   } catch (error) {
  //     console.warn('Updating SourceFile failed with:', error)

  //     return prev
  //   }
  //   return prev
  // }
  return stringToSourceFile($code)
})

export const sourceFileText = derived(sourceFile, ($sourceFile) => $sourceFile.text)

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
