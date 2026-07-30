import fs from 'fs';
import path from 'path';

const srcDir = '/Users/denim/Documents/bncc/FE B.O.S 2026/src';
const projectDir = '/Users/denim/Documents/bncc/FE B.O.S 2026';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

function checkCasing(baseDir, relativePath, fileLocation) {
  // Ignore absolute imports or aliases
  if (relativePath.startsWith('@/') || !relativePath.startsWith('.')) {
    return;
  }

  const absoluteTarget = path.resolve(baseDir, relativePath);
  
  // Only inspect if it falls inside our project workspace
  if (!absoluteTarget.startsWith(projectDir)) {
    return;
  }

  const parts = absoluteTarget.split(path.sep);

  // Traverse down, but start validation from the project directory onwards
  let currentPath = projectDir;
  const projectPartsCount = projectDir.split(path.sep).length;

  for (let i = projectPartsCount; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if (!fs.existsSync(currentPath)) {
      console.log(`❌ Folder does not exist: ${currentPath} (imported from ${fileLocation})`);
      return;
    }

    const contents = fs.readdirSync(currentPath);
    // Find if the exact case matches
    const exactMatch = contents.find((item) => item === part);
    
    if (!exactMatch) {
      // Try with common file extensions if exact folder/file match not found
      const withExtension = contents.find((item) => {
        return item === `${part}.js` || item === `${part}.jsx` || item === `${part}.tsx` || item === `${part}.ts` || item === `${part}.svg` || item === `${part}.png` || item === `${part}.jpg`;
      });

      if (withExtension) {
        // Casing of the file with extension is correct, but check if the base name matches
        const baseNameOnDisk = path.basename(withExtension, path.extname(withExtension));
        if (baseNameOnDisk !== part) {
          console.log(`❌ Case mismatch: "${part}" in import, but "${withExtension}" on disk. Location: ${fileLocation}`);
        }
      } else {
        console.log(`❌ Could not resolve: "${part}" in directory "${currentPath}". Location: ${fileLocation}`);
      }
      return;
    }
    currentPath = path.join(currentPath, exactMatch);
  }
}

const files = getFiles(srcDir);
console.log(`Scanning ${files.length} files...`);

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    checkCasing(path.dirname(file), importPath, file);
  }

  const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    checkCasing(path.dirname(file), match[1], file);
  }
});

console.log('Scan completed!');
