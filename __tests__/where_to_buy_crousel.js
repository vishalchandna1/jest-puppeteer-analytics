const timeout = 25000;
const chalk = require('chalk');
const init = require('../libs/Init.js');

describe(
  '/ (Home Page)',
  () => {
    let page;
    let window;
    let main;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();

      // We can make it dyniamic by taking the BASE_URL from the terminal using npm test -- -u="http://local.newell.com/"
      await page.goto(process.baseURL);
      await init(page);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('Testing Where to buy crousel clicks', async () => {
      await page.evaluate(async () => {
        const $containers = await jQuery('.b-where-to-buy');
        const $wrapper = await jQuery($containers[0])
          .find('.slick-track')
          .find('.slick-slide');
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Where to buy crousel block found.');
        } else {
          for (let index = 0; index < $wrapper.length; index++) {
            const $element = jQuery($wrapper[index])
              .find('.wtb__name')
              .find('a');

            let analyticsData = {
              event_name: 'where_to_buy_impressions',
              exitlink: $element.attr('href'),
              exitname: $element.attr('title') || $element.text(),
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
                product_sku: data.product_sku,
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
          }

          sinon.restore();

          LogSuccess(
            'Click - Analytics Tests Successfully Passed for Where to buy crousel.'
          );
        }
      });
    });
  },
  timeout
);
