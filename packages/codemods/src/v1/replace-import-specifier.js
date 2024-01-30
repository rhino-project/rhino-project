module.exports = (file, api) => {
  const jscodeshift = api.jscodeshift;
  const root = jscodeshift(file.source);

  root.find(jscodeshift.ImportDeclaration).forEach((path) => {
    const match = path.node.source.value.match(/^(rhino|^(\.\.\/)+rhino)(.*)$/);
    if (match) {
      let additionalPath = match[3];

      // Split the path and check the last section
      const pathSections = additionalPath.split('/');
      if (
        pathSections.length > 1 &&
        /^[A-Z]/.test(pathSections[pathSections.length - 1])
      ) {
        // Drop the last section if it starts with a capital letter
        pathSections.pop();
        additionalPath = pathSections.join('/');
      }

      // Replace with '@rhino-project' and update the path
      path.node.source.value = `@rhino-project${additionalPath}`;
    }
  });

  return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
