const fs = require('fs');

const appSr1 = JSON.parse(fs.readFileSync('./app-sr1.json', 'utf8'));
const appSr2 = JSON.parse(fs.readFileSync('./app-sr2.json', 'utf8'));

const ecosystem = {
  apps: [appSr1, appSr2]
};

fs.writeFileSync('moduler.json', JSON.stringify(ecosystem, null, 2));
console.log('moduler.json');