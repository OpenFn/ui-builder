import "./main.css";
import App from './App.svelte'


const code: string = `
if (true) { alert("hello"); }
`
const app = new App({
  target: document.body,
  props: { code }
})

export default app
