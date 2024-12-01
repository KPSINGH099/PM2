module.exports = {
  apps: [
    {
      name: 'app-sr1',
      script: 'sr1/index.js',
      env: {
        APP_ENV: 'hello'
      }
    },
    {
      name: 'app-sr2',
      script: 'sr2/index.js',
      env: {
        APP_ENV: 'world'
      }
    }
  ]
};
