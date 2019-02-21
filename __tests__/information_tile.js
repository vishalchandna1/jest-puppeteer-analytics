const timeout = 25000;
const init = require('../libs/Init.js');

describe(
  '/ (Home Page)',
  () => {
    let page;
    let window;
    let main;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();

      await init(page);
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('Testing Information tile click event', async () => {
      const data = await page.evaluate(async () => {
        const spy = window.sinon.spy(window.utag, 'link');
        const $containers = jQuery('.b-information-tile');
        if ($containers.length === 0) {
          LogWarning('No Information tile block found.');
        } else {
          for (let index = 0; index < $containers.length; index++) {
            const $wrapper = jQuery($containers[index]);
            const $elements = $wrapper.find('.info-tile');
            for (
              let wrapperIndex = 0;
              wrapperIndex < $elements.length;
              wrapperIndex++
            ) {
              const $element = jQuery($elements[wrapperIndex]);
              const elementData = $element.data();
              const analyticsData = {
                event_name: 'component_click_cta',
                event_entity: 'Component',
                event_category: 'components|' + elementData.tileName,
                event_action: 'component_click',
                event_label: 'component|' + $wrapper.data().infoTitle,
                event_location: window.document.location.pathname,
                event_click_name : 'component|' + elementData.tileName,
                event_click_position : 'component|' + $element.parent().data().tileIndex
              };

              // Triggering the click event to which would be spied by sinon.
              await $element.trigger('click');

              // Testing click event only done once.
              LogCurrentStatus('Testing - Only click on the element.');
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
              'Click - Analytics Tests Successfully Passed for Information tile.'
            );
          }
        }
        spy.restore();
      });
    });

    it('Testing Category crousel load event', async () => {
      const data = await page.evaluate(async () => {
        const $containers = jQuery('.b-information-tile');
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Information tile block found.');
        } else {
          // Triggering the load event to which would be spied by sinon.
          dispatchEvent(new Event('load'));

          // Testing load event.
          LogCurrentStatus('Testing - Load event.');
          sinon.assert.called(spy);
          LogSuccess('Success');

          // Testing for each container present in the DOM.
          $containers.each(function(i, element) {
            const elementData = jQuery(element).data();
            const analyticsData = {
              event_name: 'component_load_cta',
              event_entity: 'Component',
              event_category: 'components|' + elementData.tileTitles,
              event_action: 'component_impression',
              event_label: 'component|' + elementData.infoTitle,
              event_location: window.document.location.pathname
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
            'Load - Analytics Tests Successfully Passed for Information tile block.'
          );
        }
        spy.restore();
      });
    });
  },
  timeout
);
