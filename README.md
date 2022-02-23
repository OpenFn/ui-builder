# UI Builder

![Version](https://img.shields.io/github/package-json/v/openfn/ui-builder?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)

Web component for interacting with Javascript ASTs.
Using the Typescript compiler and AST under the hood, visualise and modify
Javascript code.

> This project is in it's infancy, and is in no way ready for production.
> If this is something that's interesting to you, please reach out!

## Usage

In your HTML, add an element to attach the component to, import the Builder
module and call it with the mounting element and optionally some initial code.

```html
<div id="editor" style="max-height: 80vh"></div>
<script>
  import('/assets/ui-builder.js')
    .then(({Builder}) => {
      Builder(document.getElementById("editor"),
      `if (true) {
        alert('foo')
       } else {
        throw new Error("bar")
       }`
    )});
</script>
```

### Add .d.ts files

> ⛔ _This is internal currently_

In the [`Editor`](src/Editor.svelte) component, .d.ts files can be added to the 
editor directly using the `addExtraLib` from `editorSetup`.

The type definitions will not be available in the Block Builder pane when done
this way.

> **NOTE** In order to emulate globally available functions (like with OpenFn
> jobs), the `.d.ts` must not have any exports on the functions.  
> A strategy for either flattening type definitions or working with a module
> that has multiple type definition files (despite only one used entrypoint) 
> hasn't been considered yet.

## Blocks

Blocks are UI components that represent AST nodes and can manipulate the editor
code.

Each block has a resolver and a components.

### Resolvers

In order to determine if a given Node in a tree should be rendered with a Block
it's resolver is called - if the function returns something truthy then it will 
rendered.

Blocks are considered on a 'first-wins' basis, that being in the list of possible
candidates, the first one wins.

> **NOTE** This may not be desirable in the future as ordering components may
> become tricky as many components will share the same NodeType like `CallExpression`.

## Deployment

Deploying libraries that use WebWorkers can be difficult, however when using
newer ESM style imports, things can get a little easier.

The recommended way of using this library is to build the entrypoint and the
workers separately.

By building the component on it's own will save your main entrypoint serveral
megabytes (Typescript's compiler is 8MB+), and more importantly when using
`esm` as the format - the workers will be available relative to the location
of the component entrypoint.

> We achieve the relative loading of the workers by using `import.meta.url`
> which can't be used outside of a ESModule. This is helpful when we want
> to load the workers only when we need them; saving network, cpu and memory
> until it's necessary.

For the component:

```
esbuild
  app=js/app.js                   # <-- Your app's entrypoint
  ui-builder=@openfn/ui-builder   # <-- the component library entrypoint
  --bundle
  --target=esnext
  --format=esm
```

And the workers...

```
esbuild
  ts.worker=@openfn/ui-builder/dist/esm/ts.worker.js
  editor.worker=@openfn/ui-builder/dist/esm/editor.worker.js
  --bundle
  --target=esnext
  --format=iife
```

> **NOTE** The workers are built with the `iife` target, this is required in
> order to maintain compatibility with Firefox.

## Getting started

```sh
yarn install
```

## Dev

```sh
yarn run dev # start dev server
yarn run lint # check and prettify your code
```

## Build for production

```sh
yarn run build
```

Deploy the directory `public/`

## Roadmap

- Correctly handle changes make via either the editor or the UI components.
- Provide components for most common ECMA language/node types.
- Dynamically import `ts.d` files for a chosen platform or library.
- Show type errors and warnings on the UI component.
- Allow extending the list of node rendering components.
- Using diagnostic information (`ts.d` or perhaps JSDoc) to inform specific
component choices.
  (Special components for libraries).
- Provide examples of complex node components. (think wrapping a node in a `try/catch`)
  Work out how to delay choosing a component, in the example of wrapping a block
	can we delay detecting the block while it's inside a different parent?
- Drag and drop reording of statements.

### Further Goals

- Allow the AST to be rendered using a canvas of some sort, linking statements
  with arrows and lines.
