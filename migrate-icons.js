const fs = require('fs');
const path = require('path');

const map = {
  'Settings': 'Cog8ToothIcon',
  'Trash2': 'TrashIcon',
  'ChevronRight': 'ChevronRightIcon',
  'ChevronLeft': 'ChevronLeftIcon',
  'ChevronDown': 'ChevronDownIcon',
  'ChevronUp': 'ChevronUpIcon',
  'Bell': 'BellIcon',
  'Shield': 'ShieldCheckIcon',
  'HelpCircle': 'QuestionMarkCircleIcon',
  'Info': 'InformationCircleIcon',
  'NotebookText': 'DocumentTextIcon',
  'Home': 'HomeIcon',
  'Trophy': 'TrophyIcon',
  'BarChart3': 'ChartBarIcon',
  'Plus': 'PlusIcon',
  'X': 'XMarkIcon',
  'Check': 'CheckIcon',
  'MoreVertical': 'EllipsisVerticalIcon',
  'MoreHorizontal': 'EllipsisHorizontalIcon',
  'ArrowLeft': 'ArrowLeftIcon',
  'ArrowRight': 'ArrowRightIcon',
  'CalendarDays': 'CalendarDaysIcon',
  'Calendar': 'CalendarIcon',
  'AlertTriangle': 'ExclamationTriangleIcon',
  'Lightbulb': 'LightBulbIcon',
  'Quote': 'ChatBubbleBottomCenterTextIcon',
  'FileText': 'DocumentTextIcon',
  'Star': 'StarIcon',
  'Crown': 'SparklesIcon',
  'Medal': 'TrophyIcon',
  'Gem': 'SparklesIcon',
  'Flame': 'FireIcon',
  'Book': 'BookOpenIcon',
  'Sparkles': 'SparklesIcon',
  'TrendingUp': 'ArrowTrendingUpIcon',
  'TrendingDown': 'ArrowTrendingDownIcon',
  'Activity': 'ChartBarSquareIcon',
  'Clock': 'ClockIcon',
  'Share2': 'ShareIcon',
  'Hourglass': 'ClockIcon',
  'Heart': 'HeartIcon',
  'Frown': 'FaceFrownIcon',
  'Meh': 'FaceFrownIcon',
  'Smile': 'FaceSmileIcon',
  'Wallet': 'WalletIcon',
  'Target': 'RocketLaunchIcon',
  'RotateCcw': 'ArrowPathIcon',
  'Award': 'StarIcon',
  'Lock': 'LockClosedIcon',
  'Send': 'PaperAirplaneIcon'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (fullPath.includes(path.join('components', 'ui'))) continue;
      if (fullPath.includes('bottom-nav.tsx')) continue; // Already manually updated
      
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('lucide-react')) {
        let lucideImports = content.match(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/);
        if (lucideImports) {
          const imports = lucideImports[1].split(',').map(i => i.trim()).filter(i => i);
          const heroImports = [];
          for (let i = 0; i < imports.length; i++) {
            let imp = imports[i];
            let original = imp;
            let alias = null;
            if (imp.includes(' as ')) {
               [original, alias] = imp.split(' as ').map(s => s.trim());
            }
            if (map[original]) {
              const translated = alias ? `${map[original]} as ${alias}` : map[original];
              heroImports.push(translated);
              
              const regexTag = new RegExp(`\\<(${alias || original})\\b`, 'g');
              const replaceWith = alias || map[original];
              content = content.replace(regexTag, `<${replaceWith}`);
              
              const regexVar = new RegExp(`\\b(${alias || original})\\b(?!\\s*=)(?!\\s*as)`, 'g');
              content = content.replace(regexVar, replaceWith);
            } else {
              heroImports.push(original); // fallback
            }
          }
          
          content = content.replace(lucideImports[0], `import { ${[...new Set(heroImports)].join(', ')} } from '@heroicons/react/24/outline'`);
          
          fs.writeFileSync(fullPath, content);
          console.log('Updated', fullPath);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'app'));
processDir(path.join(__dirname, 'components'));
