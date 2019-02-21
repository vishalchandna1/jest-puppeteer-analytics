const goTo = async function(page, path) {
  await page.goto(process.env.baseURL + (path ? path : ''));
}

module.exports = goTo;
