import { writable, derived, get, Readable } from 'svelte/store'
import { createCodeStore, createASTStore, createContext, createEditorContext } from '../src/contextManager'
import type { LibOption } from '../src/contextManager'
import type { EditorFactory } from '../src/types'

describe('ContextManager', () => {
  it('can be started', () => {
    const code = createCodeStore('schmancy')

    expect(get(code)).toEqual('schmancy')

    code.set('fancy')

    expect(get(code)).toEqual('fancy')
  })

  it('can get an AST', () => {
    const code = createCodeStore('schmancy')

    const ast = createASTStore(code)
    expect(get(ast)).toEqual('schmancyimma ast')
  })

  describe('createContext', () => {
    it('should feel like', () => {
      // give me an editor?
      // add some type libs

      const libOption: LibOption = ['', 'ts:language-common/index.d.ts']
      const context = createContext({ code: 'foo()', libs: [libOption] })

      const { code, libs } = context

      expect(get(code)).toEqual('foo()')
      expect(get(libs)).toEqual([libOption])
    })
  })

  describe('createEditorContext', () => {
    it('creates an editor when elem is provided', async () => {
      let editorOptions = writable({ a: 1 })
      const elem = writable()

      const mockEditorFactory = jest.fn(() => "editor");

      const editorContext =
        createEditorContext({
          code: "fancy",
          // @ts-ignore
          editorFactory: mockEditorFactory,
          editorOptions: {}
        })

      expect(get(editorContext.editor)).toEqual(null)

      // @ts-ignore
      editorContext.elem.set('html element')

      expect(get(editorContext.editor)).toEqual("editor")

      expect(mockEditorFactory.mock.calls.length).toBe(1);
      expect(mockEditorFactory.mock.calls[0]).toEqual(['html element', {}]);

      // await subscribeUntil(editorContext, (val: any) => {
      // 	expect(val).toEqual('im the editor')
      // })
    })
  })
})

function subscribeUntil(store: Readable<any>, expectation: any) {
  return new Promise((resolve, reject) => {
    let i = 1
    store.subscribe((val) => {
      try {
        expectation(val)
        resolve(val)
      } catch (e) {
        i += 1
        if (i >= 3) {
          reject(e)
        }
      }
    })
  })
}
