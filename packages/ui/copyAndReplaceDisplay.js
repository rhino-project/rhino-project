import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Function to get display type or display group type from command line arguments
function getDisplayTypeInfo() {
  const displayTypeIndex = process.argv.indexOf('--display-type') + 1;
  if (displayTypeIndex > 0) {
    return { type: 'display', value: process.argv[displayTypeIndex] };
  }

  const displayGroupTypeIndex =
    process.argv.indexOf('--display-group-type') + 1;
  if (displayGroupTypeIndex > 0) {
    return {
      type: 'display-group',
      value: process.argv[displayGroupTypeIndex]
    };
  }

  return null;
}

// Function to replace all occurrences of 'String' with the new display type
function replaceStringInFile(content, displayType) {
  return content.replace(/String/g, displayType);
}

// Function to copy and modify a file
function copyAndModifyFile(sourceFileName, destinationFileName, displayType) {
  const sourcePath = join(__dirname, sourceFileName);
  const destinationPath = join(__dirname, destinationFileName);

  readFile(sourcePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading the source file ${sourcePath}:`, err);
      return;
    }

    const modifiedContent = replaceStringInFile(data, displayType);

    writeFile(destinationPath, modifiedContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing the new file ${destinationPath}:`, err);
        return;
      }
      console.log(`File created successfully: ${destinationPath}`);
    });
  });
}

// Execution starts here
const displayTypeInfo = getDisplayTypeInfo();

if (!displayTypeInfo) {
  console.error(
    'Display type or display group type not specified. Use --display-type <type> or --display-group-type <type>.'
  );
} else {
  if (displayTypeInfo.type === 'display') {
    ['DisplayGroupString.js'].forEach((fileName) => {
      const newFileName = fileName.replace('String', displayTypeInfo.value);
      copyAndModifyFile(
        `src/components/forms/displayGroups/${fileName}`,
        `src/components/forms/displayGroups/${newFileName}`,
        displayTypeInfo.value
      );
    });
  } else if (displayTypeInfo.type === 'display-group') {
    ['ModelDisplayGroupString.js'].forEach((fileName) => {
      const newFileName = fileName.replace('String', displayTypeInfo.value);
      copyAndModifyFile(
        `src/components/models/displayGroups/${fileName}`,
        `src/components/models/displayGroups/${newFileName}`,
        displayTypeInfo.value
      );
    });
  }
}
