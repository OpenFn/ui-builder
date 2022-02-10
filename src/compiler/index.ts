import * as ts from 'typescript'

import {
  createDefaultMapFromNodeModules,
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
  VirtualTypeScriptEnvironment
} from '@typescript/vfs'

export async function assembleCompiler(code: string): Promise<BaseCompiler> {
  const shouldCache = true
  // This caches the lib files in the site's localStorage
  const fsMap = await createDefaultMapFromCDN(
    { target: ts.ScriptTarget.ES2020 },
    '4.5.4',
    shouldCache,
    ts
  )

  const compiler: BaseCompiler = new BaseCompiler(fsMap)
  compiler.addFile(code)

  return compiler
}

export class BaseCompiler {
  fsMap: Map<string, string>
  env: VirtualTypeScriptEnvironment
  system: ts.System
  transformers: Array<(program: ts.Program, options: {}) => ts.TransformerFactory<ts.SourceFile>>
  transformOptions: {}

  constructor(fsMap?: Map<string, string> = new Map()) {
    this.transformers = []
    // You start with creating a map which represents all the files in the virtual ts.System
    // this.fsMap = createDefaultMapFromNodeModules(BaseCompiler.compilerOpts, ts);
    //

    this.fsMap = fsMap

    // If you need a FS backed system, useful for debugging missing definitions.
    // const projectRoot = join(__dirname, "..");
    // this.system = createFSBackedSystem(fsMap, projectRoot, ts)
    this.system = createSystem(this.fsMap)
    this.env = createVirtualTypeScriptEnvironment(this.system, [], ts, BaseCompiler.compilerOpts)
  }

  /**
   * Add the adaptors type definition to the compilers filesystem map
   * @param moduleName the name of the module that will be imported,
   * i.e. the adaptors name `@openfn/language-http`.
   * @param dts the .d.ts file as a string
   */
  addTypeDefinition(moduleName: string, dts: string) {
    const typedModulePath = moduleName.replace('@', '').replace('/', '__')

    this.fsMap.set(`/node_modules/@types/${typedModulePath}/index.d.ts`, dts)
    this.env.createFile(`${typedModulePath}.d.ts`, dts)
  }

  addAdaptorFSMap(adaptorPackagePath: string) {
    addAdaptorFSMap(this.fsMap, adaptorPackagePath)
  }

  wrap(func: (sf: ts.SourceFile, ...args: any[]) => ts.SourceFile, ...args: any[]) {
    return func(this.sourceFile, ...args)
  }

  public get program(): ts.Program {
    return this.env.languageService.getProgram()!
  }

  public get sourceFile(): ts.SourceFile {
    return this.program.getSourceFile('index.ts')!
  }

  addFile(expression: string, filename: string = 'index.ts') {
    this.env.createFile(filename, expression)
  }

  useTransform(func: () => ts.TransformerFactory<ts.SourceFile>) {
    this.transformers.push(func)
  }

  getDiagnostics(): readonly ts.Diagnostic[] {
    return ts.getPreEmitDiagnostics(this.program, this.sourceFile)
    // return this.env.languageService.getSemanticDiagnostics("index.ts");
  }

  formatDiagnostics(): string[] {
    return this.getDiagnostics().map((diagnostic) => {
      if (diagnostic.file) {
        let { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start!
        )
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      }
    })
  }

  compile(): string {
    const sourceFile = this.program.getSourceFile('index.ts')
    const emitResult = this.program.emit(sourceFile, this.system.writeFile, undefined, false, {
      before: this.transformers.map((t) => t(this.program, this.transformOptions)), // [transformer(this.program, {})],
      after: [],
      afterDeclarations: []
    })

    return this.system.readFile('index.js')!
  }

  static compilerOpts: ts.CompilerOptions = {
    experimentalDecorators: true,
    module: ts.ModuleKind.ES2020,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    // stripInternal: true,
    // declaration: true,
    baseUrl: './',
    lib: ['ES2021', 'DOM'],
    target: ts.ScriptTarget.ES2021
  }

  transform(): ts.TransformationResult<ts.Node> {
    const transformedSourceFile = ts.transform(
      this.sourceFile,
      [transformer(this.program, this.transformOptions)],
      BaseCompiler.compilerOpts
    )

    return transformedSourceFile
    // const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    // return printer.printFile(transformedSourceFile[0]);
  }
}
