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

      // Initialize an array to hold all specifiers as named imports
      const newSpecifiers = [];

      // Convert default import to named import if it exists
      path.node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          // Use the default import's name as a named import
          newSpecifiers.push(
            jscodeshift.importSpecifier(
              jscodeshift.identifier(specifier.local.name)
            )
          );
        } else if (specifier.type === 'ImportSpecifier') {
          // Keep named imports as they are
          newSpecifiers.push(specifier);
        }
      });

      // Update the specifiers on the import declaration
      path.node.specifiers = newSpecifiers;

      // Update the import path
      path.node.source.value = `@rhino-project/core${additionalPath}`;
    }
  });

  return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
