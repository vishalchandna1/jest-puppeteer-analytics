const chalk = require('chalk')
const puppeteer = require('puppeteer')
const fs = require('fs')
const mkdirp = require('mkdirp')
const os = require('os')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function() {
  console.log(chalk.green('Setup Puppeteer'))
  const browser = await puppeteer.launch({devtools: true});
  // This global is not available inside tests but only in global teardown
  global.__BROWSER_GLOBAL__ = browser
  // Instead, we expose the connection details via file system to be used in tests
  mkdirp.sync(DIR)

  // Getting the base url of current environment.
  const args = process.argv;
  let BASE_URL = '';
  for (var i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.includes('-u')) {
      BASE_URL = arg.split('-u=')[1]
    }
  }
  process.baseURL = BASE_URL;
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
