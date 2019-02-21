const chalk = require('chalk')
const includeSinon = require('./includeSinon');
const goTo = require('./goTo');

const init = async function(page, path) {
  // We can make it dyniamic by taking the BASE_URL from the terminal using npm test -- -u="http://local.newell.com/"
  await goTo(page, path);
  
  // Inject sinonjs.
  await includeSinon(page);
  
  // Expose the console functions.
  await page.exposeFunction('LogSuccess', data => {
    return console.log(chalk.green(data))
  })
  await page.exposeFunction('LogCurrentStatus', data => {
    return console.log(chalk.yellow(data))
  })
  await page.exposeFunction('LogWarning', data => {
    return console.log(chalk.red(data))
  })

  jest.setTimeout(10000);
  page.on('console', msg => {
    for (let i = 0; i < msg.args.length; ++i) console.log(`${msg.args[i]}`)
  })
}


module.exports = init;
