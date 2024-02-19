module.exports = (file, api) => {
  const jscodeshift = api.jscodeshift;
  const root = jscodeshift(file.source);

  root.find(jscodeshift.ImportDeclaration).forEach((path) => {
    const match = path.node.source.value.match(/^(rhino|^(\.\.\/)+rhino)(.*)$/);
    if (match) {
      let additionalPath = match[3];
      const pathSections = additionalPath.split('/');

      if (
        pathSections.length > 1 &&
        /^[A-Z]/.test(pathSections[pathSections.length - 1])
      ) {
        pathSections.pop();
        additionalPath = pathSections.join('/');
      }

      // Convert default imports to named imports if necessary
      if (
        path.node.specifiers.length === 1 &&
        path.node.specifiers[0].type === 'ImportDefaultSpecifier'
      ) {
        const defaultImportName = path.node.specifiers[0].local.name;
        // Replace the default import with a named import
        path.node.specifiers = [
          jscodeshift.importSpecifier(jscodeshift.identifier(defaultImportName))
        ];
      }

      // Update the import path
      path.node.source.value = `@rhino-project/core${additionalPath}`;
    }
  });

  return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
