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

      // We can make it dyniamic by taking the BASE_URL from the terminal using npm test -- -u="http://local.newell.com/"
      await page.goto(process.baseURL);
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
              var analyticsData = {
                event_name: 'information_tile_click_cta',
                event_entity: 'InformationTile',
                event_category: 'information_tile|info_tile|' + elementData.tileName,
                event_action: 'information_tile_click',
                event_label: 'information_tile|' + $wrapper.data().infoTitle,
                event_location: window.document.location.pathname,
                event_click_name : 'information_tile|' + elementData.tileName,
                event_click_position : 'information_tile|' + $element.parent().data().tileIndex
              };

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
            LogSuccess(
              'Analytics Tests Successfully Passed for Information tile click.'
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
            var analyticsData = {
              event_name: 'information_tile_load_cta',
              event_entity: 'InformationTile',
              event_category: 'information_tile|info_tile|' + elementData.tileTitles,
              event_action: 'information_tile_impression',
              event_label: 'information_tile|' + elementData.infoTitle,
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
