const timeout = 25000;
const chalk = require('chalk');
const init = require('../libs/Init.js');

describe(
  '/ (Home Page)',
  () => {
    let page;
    let window;
    let main;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();

      // We can make it dyniamic by taking the BASE_URL from the terminal using npm test -- -u="http://local.newell.com/"
      await page.goto(process.baseURL);
      await init(page);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('Testing analytics click event', async () => {
      const data = await page.evaluate(async () => {
        const spy = window.sinon.spy(window.utag, 'link');
        const $containers = jQuery('.b-50-50');
        if ($containers.length === 0) {
          LogWarning('No 50-50 Block found.');
        } else {
          for (let index = 0; index < $containers.length; index++) {
            const $wrapper = jQuery($containers[index]);
            const $element = $wrapper.find('.b-50-50__container');
            const elementData = $element.data();
            var analyticsData = {
              event_name: 'component_click_5050',
              event_entity: 'Component',
              event_category: 'components|5050',
              event_action: 'component_click',
              event_label: 'component|' + elementData.title,
              event_location: window.document.location.pathname,
            };

            // Triggering the click event to which would be spied by sinon.
            await $element.trigger('click');

            // Testing click event only done once.
            LogCurrentStatus('Testing - Only one click on the element.');
            sinon.assert.calledOnce(spy);
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
            LogSuccess('Analytics Tests Successfully Passed for 50-50 Block.');
          }
        }
        spy.restore();
      });
    });

    it('Testing analytics load event', async () => {
      const data = await page.evaluate(async () => {
        const $containers = jQuery('.b-50-50');
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No 50-50 Block found.');
        } else {
          // Triggering the load event to which would be spied by sinon.
          dispatchEvent(new Event('load'));

          // Testing load event.
          LogCurrentStatus('Testing - Load event.');
          sinon.assert.called(spy);
          LogSuccess('Success');

          // Testing for each container present in the DOM.
          $containers.each(function(i, element) {
            var elementData = jQuery(element)
              .find('.b-50-50__container')
              .data();
            var analyticsData = {
              event_name: 'component_impression_5050',
              event_entity: 'Component',
              event_category: 'components|5050',
              event_action: 'component_impression',
              event_label: 'component|' + elementData.title,
              event_location: window.document.location.pathname,
            };

            LogCurrentStatus(`Testing container - ${i}`);

            // Verifying each entity of the analytics payload object.
            for (let i in analyticsData) {
              LogCurrentStatus(`Testing analyticsObject key - ${i}`);
              sinon.assert.calledWith(
                spy,
                sinon.match({ [i]: analyticsData[i] })
              );
              LogSuccess('Success');
            }
            LogSuccess(`Successfully tested container - ${i}`);
          });

          // Log - Successfull pass for all tests.
          LogSuccess(
            'Load - Analytics Tests Successfully Passed for 50-50 Block.'
          );
        }
        spy.restore();
      });
    });
  },
  timeout
);
