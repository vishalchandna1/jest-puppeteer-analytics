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

    it('Testing Category crousel click', async () => {
      const data = await page.evaluate(async () => {
        const spy = window.sinon.spy(window.utag, 'link');
        const $containers = jQuery('.b-category-carousel');
        if ($containers.length === 0) {
          LogWarning('No Category crousel block found.');
        } else {
          for (let index = 0; index < $containers.length; index++) {
            const $wrapper = jQuery($containers[index]);
            const $elements = $wrapper.find('.slick-slide');
            for (
              let wrapperIndex = 0;
              wrapperIndex < $elements.length;
              wrapperIndex++
            ) {
              const $element = jQuery($elements[wrapperIndex]);
              const elementData = $element.find('.wtb__item').data();
              const analyticsData = {
                event_name: 'category_click_carousel',
                event_entity: 'Category',
                event_category:
                  'category_carousel|' + window.drupalSettings.newell.page_name,
                event_action: 'category_click',
                event_label: 'category_carousel|' + elementData.categoryName,
                event_location: window.document.location.pathname,
                event_click_name:
                  'category_carousel|' + elementData.categoryName,
                event_click_position:
                  'category_carousel|' + ($element.data().slickIndex + 1),
              };

              // Triggering the click event to which would be spied by sinon.
              await $element.find('.wtb__item').trigger('click');

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
              'Click - Analytics Tests Successfully Passed for Category crousel.'
            );
          }
        }
        spy.restore();
      });
    });

    it('Testing Category crousel load', async () => {
      const data = await page.evaluate(async () => {
        const $containers = jQuery('.b-category-carousel');
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Category crousel block found.');
        } else {
          // Triggering the load event to which would be spied by sinon.
          dispatchEvent(new Event('load'));

          // Testing load event.
          LogCurrentStatus('Testing - Load event.');
          sinon.assert.called(spy);
          LogSuccess('Success');

          // Testing for each container present in the DOM.
          $containers.each(function(i, element) {
            const analyticsData = {
              event_name: 'category_impression_carousel',
              event_entity: 'Category',
              event_category:
                'category_carousel|' + window.drupalSettings.newell.page_name,
              event_action: 'category_impression',
              event_label:
                'category_carousel|' + jQuery(element).data().carouselNames,
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
            'Load - Analytics Tests Successfully Passed for Category crousel block.'
          );
        }
        spy.restore();
      });
    });
  },
  timeout
);
