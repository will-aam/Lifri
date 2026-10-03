const fs = require('fs');
const path = require('path');

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (fullPath.includes(path.join('components', 'ui'))) continue;
      if (fullPath.includes('bottom-nav.tsx')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('lucide-react')) {
        content = content.replace(/from\s+["']lucide-react["']/g, 'from "@heroicons/react/24/outline"');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

fixDir(path.join(__dirname, 'app'));
fixDir(path.join(__dirname, 'components'));
