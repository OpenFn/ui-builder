import './main.css'
// rename to a 'component'.
import App from './App.svelte'
import { code, createCompilerStore } from './sourceFileStore';

export function Builder(elem: HTMLElement, initialCode: string): App {
  const compilerStore = createCompilerStore(initialCode);

  const app = new App({ target: elem, props: { compilerStore }})
  return app
}
