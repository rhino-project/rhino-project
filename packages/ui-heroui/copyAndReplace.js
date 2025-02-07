import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Function to get field type or field group type from command line arguments
function getFieldTypeInfo() {
  const fieldTypeIndex = process.argv.indexOf('--field-type') + 1;
  if (fieldTypeIndex > 0) {
    return { type: 'field', value: process.argv[fieldTypeIndex] };
  }

  const fieldGroupTypeIndex = process.argv.indexOf('--field-group-type') + 1;
  if (fieldGroupTypeIndex > 0) {
    return { type: 'field-group', value: process.argv[fieldGroupTypeIndex] };
  }

  return null;
}

// Function to replace all occurrences of 'String' with the new field type
function replaceStringInFile(content, fieldType) {
  return content.replace(/String/g, fieldType);
}

// Function to copy and modify a file
function copyAndModifyFile(sourceFileName, destinationFileName, fieldType) {
  const sourcePath = join(__dirname, sourceFileName);
  const destinationPath = join(__dirname, destinationFileName);

  readFile(sourcePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading the source file ${sourcePath}:`, err);
      return;
    }

    const modifiedContent = replaceStringInFile(data, fieldType);

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
const fieldTypeInfo = getFieldTypeInfo();

if (!fieldTypeInfo) {
  console.error(
    'Field type or field group type not specified. Use --field-type <type> or --field-group-type <type>.'
  );
} else {
  if (fieldTypeInfo.type === 'field') {
    ['FieldGroupString.js'].forEach((fileName) => {
      const newFileName = fileName.replace('String', fieldTypeInfo.value);
      copyAndModifyFile(
        `src/components/forms/fieldGroups/${fileName}`,
        `src/components/forms/fieldGroups/${newFileName}`,
        fieldTypeInfo.value
      );
    });
  } else if (fieldTypeInfo.type === 'field-group') {
    ['ModelFieldGroupString.js'].forEach((fileName) => {
      const newFileName = fileName.replace('String', fieldTypeInfo.value);
      copyAndModifyFile(
        `src/components/models/fieldGroups/${fileName}`,
        `src/components/models/fieldGroups/${newFileName}`,
        fieldTypeInfo.value
      );
    });
  }
}
