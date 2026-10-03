const fs = require('fs');
const path = require('path');

function dedupeImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      dedupeImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let match = content.match(/import\s+\{([^}]+)\}\s+from\s+["']@heroicons\/react\/24\/(outline|solid)["']/);
      if (match) {
        let imports = match[1].split(',').map(s => s.trim()).filter(s => s);
        let uniqueImports = [...new Set(imports)];
        if (imports.length !== uniqueImports.length) {
          content = content.replace(match[0], `import { ${uniqueImports.join(', ')} } from '@heroicons/react/24/${match[2]}'`);
          fs.writeFileSync(fullPath, content);
          console.log('Deduped imports in', fullPath);
        }
      }
    }
  }
}

dedupeImports(path.join(__dirname, 'app'));
dedupeImports(path.join(__dirname, 'components'));
