import { writable } from 'svelte/store'

export const code = writable(`if (true) { alert("foo") };`)
export function replaceText(start: number, end: number, content: string) {
	console.log("replaceText");
	
  return code.update((codeString: string) => {
    const newCodeString: string = `${codeString.slice(0, start)}${content}${codeString.slice(
      end,
      codeString.length
    )}`

    console.log('updating code', {content, newCodeString})
    return newCodeString
  })
}
