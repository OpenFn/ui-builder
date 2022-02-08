import './main.css'
// rename to a 'component'.
import App from './App.svelte'

export function Builder(elem: HTMLElement): App {
  const app = new App({ target: elem })
  return app
}
