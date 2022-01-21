# UI Builder

![Version](https://img.shields.io/github/package-json/v/openfn/language-common?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)

Web component for interacting with Javascript ASTs.
Using the Typescript compiler and AST under the hood, visualise and modify
Javascript code.

> This project is in it's infancy, and is in no way ready for production. 
> If this is something that's interesting to you, please reach out!

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