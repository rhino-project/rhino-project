import fs from 'fs/promises';
import { sync } from 'glob';
import parser from '@babel/parser';
import traverse from '@babel/traverse';

// Function to read and parse a file
const parseFile = async (file) => {
  const content = await fs.readFile(file, 'utf-8');
  return parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
};

// Function to extract arguments from specific hooks
const findHookArguments = (ast, hookName) => {
  const args = new Set();
  traverse.default(ast, {
    CallExpression(path) {
      if (path.node.callee.name === hookName) {
        const firstArg = path.node.arguments[0];
        if (firstArg && firstArg.type === 'StringLiteral') {
          args.add(firstArg.value);
        }
      }
    }
  });
  return args;
};

// Function to generate TypeScript definition
const generateTypeScript = (strings, typeName) => {
  let tsCode = `export type ${typeName} = {\n`;

  strings.sort().forEach((str) => {
    tsCode += `  "${str}": RhinoConfigComponent;\n`;
  });

  tsCode += '};\n\n';

  return tsCode;
};

// Main function to parse all files, extract arguments, and write TypeScript file
const main = async () => {
  const pattern = 'src/**/*.{js,jsx,ts,tsx}';
  const ignorePattern = 'src/__tests__/**';

  const files = sync(pattern, { ignore: ignorePattern, absolute: true });

  const globalComponentArgs = new Set();
  const modelComponentArgs = new Set();
  const attributeComponentArgs = new Set();

  for (const file of files) {
    const ast = await parseFile(file);
    findHookArguments(ast, 'useGlobalComponent').forEach((arg) =>
      globalComponentArgs.add(arg)
    );
    findHookArguments(ast, 'useGlobalComponentForModel').forEach((arg) =>
      modelComponentArgs.add(arg)
    );
    findHookArguments(ast, 'useGlobalComponentForAttribute').forEach((arg) =>
      attributeComponentArgs.add(arg)
    );
  }

  const tsCode = `
export type RhinoConfigComponentShort = React.ComponentType<unknown>;

export interface RhinoConfigComponentExpanded {
  component?: React.ComponentType<unknown>;
  props?: Record<string, unknown>;
}

export type RhinoConfigComponent =
  | RhinoConfigComponentShort
  | RhinoConfigComponentExpanded;

${generateTypeScript([...globalComponentArgs], 'RhinoConfigGlobalComponentMap')}
${generateTypeScript([...modelComponentArgs], 'RhinoConfigModelComponentMap')}
${generateTypeScript(
  [...attributeComponentArgs],
  'RhinoConfigAttributeComponentMap'
)}
`;

  await fs.writeFile('../config/src/components.tsx', tsCode);

  console.log(
    'The TypeScript definitions have been saved in src/rhino/config/components.tsx!'
  );
};

main().catch(console.error);
