const includeSinon = async function(page) {
  await page.addScriptTag({
    url:
      'https://cdnjs.cloudflare.com/ajax/libs/sinon.js/7.2.3/sinon.min.js',
  })
}

module.exports = includeSinon;
