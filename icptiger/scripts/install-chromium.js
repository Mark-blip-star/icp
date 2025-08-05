const { execSync } = require('child_process');
execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
