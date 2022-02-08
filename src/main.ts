import './main.css'
// rename to a 'component'.
import App from './App.svelte'
import { code } from './sourceFileStore';

export function Builder(elem: HTMLElement, initialCode: string): App {
  if (initialCode) {
    code.update(() => initialCode);
  }

  const app = new App({ target: elem })
  return app
}
