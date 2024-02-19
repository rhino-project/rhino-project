// https://chat.openai.com/share/e/5481e14a-668e-48f5-a049-eacb8a8e1e60
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

      // Define the new hook special cases
      const isHookSpecialCase =
        match[0].endsWith('rhino/hooks/auth') ||
        match[0].endsWith('rhino/hooks/owner') ||
        match[0].endsWith('rhino/hooks/history');

      // Existing special cases
      const isModelLoaderSpecialCase =
        path.node.specifiers.length === 1 &&
        path.node.specifiers[0].type === 'ImportDefaultSpecifier' &&
        path.node.specifiers[0].local.name === 'modelLoader' &&
        match[0].endsWith('rhino/models');

      const isRoutesSpecialCase = match[0].endsWith('rhino/utils/routes');
      const isModelsSpecialCase = match[0].endsWith('rhino/utils/models');
      const isModelRoutesSpecialCase = match[0].endsWith('rhino/routes/model');

      if (
        !isModelLoaderSpecialCase &&
        !isRoutesSpecialCase &&
        !isModelsSpecialCase &&
        !isModelRoutesSpecialCase &&
        !isHookSpecialCase
      ) {
        // Convert all specifiers to named imports for general cases
        const newSpecifiers = path.node.specifiers.map((specifier) => {
          if (specifier.type === 'ImportDefaultSpecifier') {
            return jscodeshift.importSpecifier(
              jscodeshift.identifier(specifier.local.name)
            );
          }
          return specifier;
        });
        path.node.specifiers = newSpecifiers;
      }

      // Update the import path based on special cases
      if (isModelLoaderSpecialCase) {
        path.node.source.value = `@rhino-project/core/models`;
      } else if (isRoutesSpecialCase || isModelsSpecialCase) {
        path.node.source.value = `@rhino-project/core/utils`;
      } else if (isModelRoutesSpecialCase) {
        path.node.source.value = `@rhino-project/core/routes`;
      } else if (isHookSpecialCase) {
        path.node.source.value = `@rhino-project/core/hooks`;
      } else {
        path.node.source.value = `@rhino-project/core${additionalPath}`;
      }
    }
  });

  return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
