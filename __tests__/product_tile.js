const timeout = 25000;
const init = require('../libs/Init.js');

describe(
  '/ (Search Page)',
  () => {
    let page;
    let window;
    let main;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await init(page, '/search?search=smart+pens');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('Testing Product tile click', async () => {
      const data = await page.evaluate(async () => {
        const spy = window.sinon.spy(window.utag, 'link');
        const $containers = jQuery('.product-tile');
        if ($containers.length === 0) {
          LogWarning('No Product tile block found.');
        } else {
          // Testing only for 5 or < 5 product tile elements.
          const elementsToBeTested = (($containers.length > 5) ? 5 : $containers.length)
          for (let index=0; index < elementsToBeTested ; index++) {
            const $element = jQuery($containers[index]);
            const elementData = $element.data();
            const eventName = $element.closest('[data-analytics-event-name]').data('analytics-event-name');
            const position =  eventName === 'carousel' ? ($element.closest('.slick-slide').data('slick-index') + 1) : $element.closest('[data-position]').data('position');
            
            function pipe(array) {
              return array ? array.join('|') : '';
            }

            const analyticsData = {
              event_name: 'sku_' + eventName,
              product_position: position,
              'product_id.sku': elementData.selectedSku,
              'product_id.masterid': elementData.product_id,
              product_brand: pipe(elementData.product_brand),
              product_category: pipe(elementData.product_category),
              product_id: elementData.product_id,
              product_name: elementData.product_name,
              product_price: elementData.product_price,
              product_sku: elementData.product_sku,
              product_subcategory: pipe(elementData.product_subcategory),
            };

            // Triggering the click event to which would be spied by sinon.
            await $element.trigger('click');

            // Testing click event.
            LogCurrentStatus('Testing - click on the element.');
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
          LogSuccess(
            'Click - Analytics Tests Successfully Passed for Product tile.'
          );
        }
        spy.restore();
      });
    });
  },
  timeout
);
