const timeout = 20000;
const chalk = require('chalk');
const init = require('../libs/Init.js');

describe(
  '/ Product Detail Page',
  () => {
    let page;
    let window;
    let main;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();

      // We can make it dyniamic by taking the BASE_URL from the terminal using npm test -- -u="http://local.newell.com/"
      await page.goto(
        process.baseURL +
          '/pens/colored-lead-refills/PMColoredLeadRefillsPink0.7mm'
      );
      await init(page);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });
    it('Testing Where to buy button clicks on PDP', async () => {
      await page.evaluate(async () => {
        const $container = await jQuery('.commerce-tile__wtb');
        const spy = window.sinon.spy(window.utag, 'link');

        if ($container.length === 0) {
          LogWarning('No Where to buy button found.');
        } else {
          const $element = $container.find('a');

          let analyticsData = {
            event_name: 'where_to_buy',
            product_sku: window.location.pathname.split('/').pop(),
          };

          function pipe(array) {
            return array ? array.join('|') : '';
          }

          const data = window.utag_data;

          analyticsData =
            data &&
            Object.assign({}, analyticsData, {
              product_brand: pipe(data.product_brand),
              product_category: pipe(data.product_category),
              product_id: data.product_id,
              product_name: data.product_name,
              product_price: data.product_price,
              product_subcategory: pipe(data.product_subcategory),
            });

          // Triggering the click event to which would be spied by sinon.
          await $element.trigger('click');

          // Testing click event only done once.
          LogCurrentStatus('Testing - Only one click on the element.');
          sinon.assert.called(spy);
          LogSuccess('Success');

          // Verifying each entity of the analytics payload object.
          for (let i in analyticsData) {
            LogCurrentStatus(`Testing analyticsObject key - ${i}`);
            sinon.assert.calledWith(
              spy,
              sinon.match({ [i]: analyticsData[i] })
            );
            LogSuccess('Success');
          }
          sinon.restore();
          LogSuccess(
            'Click - Analytics Tests Successfully Passed for Where to buy button on PDP.'
          );
        }
      });
    });
  },
  timeout
);
