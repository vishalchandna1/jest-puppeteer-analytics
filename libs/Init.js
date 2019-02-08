const chalk = require('chalk')
const includeSinon = require('./includeSinon');

const init = async function(page) {
  await includeSinon(page);
  await page.exposeFunction('LogSuccess', data => {
    return console.log(chalk.green(data))
  })
  await page.exposeFunction('LogCurrentStatus', data => {
    return console.log(chalk.yellow(data))
  })
  await page.exposeFunction('LogWarning', data => {
    return console.log(chalk.red(data))
  })

  page.on('console', msg => {
    for (let i = 0; i < msg.args.length; ++i) console.log(`${msg.args[i]}`)
  })
}


module.exports = init;
