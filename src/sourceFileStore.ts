import { writable } from 'svelte/store'

export const code = writable(`if (true) { alert("foo") };`)
export function replaceText(start: number, end: number, content: string) {
  code.update((codeString: string) => {
    return codeString.slice(0, start) + content + codeString.slice(end + 1, codeString.length)

  })
}
