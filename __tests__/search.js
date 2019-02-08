const timeout = 25000;
const init = require('../libs/Init.js');
const includeSinon = require('../libs/includeSinon');

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

    afterEach(async () => {
      await page.close();
    });

    it('Testing Search block submit/click', async () => {
      await page.evaluate(async () => {
        const $containers = await jQuery(
          '#views-exposed-form-acquia-search-autocomplete-search-block'
        );
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Search block found.');
        } else {
          const $element = $containers.find('#edit-search');
          const $elementAction = $containers.find('#edit-submit-acquia-search');
          var analyticsData = {
            event_name: 'feature_search_input',
            event_entity: 'Feature',
            event_category: 'feature|search',
            event_action: 'search_typed',
            event_label: 'search|' + jQuery.trim($element.val()),
            event_location: window.document.location.pathname,
          };

          // Triggering the click event to which would be spied by sinon.
          await $elementAction.trigger('click');

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
            'Click - Analytics Tests Successfully Passed Search block.'
          );
        }
      });
    });

    it('Testing Search page load function', async () => {
      await page.goto(process.baseURL + '/search?search=test');
      await includeSinon(page);
      await page.evaluate(async () => {
        const $containers = await jQuery(
          '.block-views-blockacquia-search-block-1'
        );
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Search page block found.');
        } else {
          let resultCount = 0;
          let searchText = null;
          if (jQuery('.results-string-container').length) {
            searchText = jQuery('.search-term').text();
            resultCount = jQuery('.results-string-container').data(
              'search-count'
            );
          } else {
            searchText = jQuery('.no-results-sorry').data('search-noresult');
          }

          var analyticsData = {
            event_name: 'feature_search_results',
            event_entity: 'Feature',
            event_category: 'feature|search',
            event_action: 'search_results',
            event_label: 'search|' + searchText,
            event_location: window.document.location.pathname,
            event_value: resultCount,
          };

          // Triggering the load event to which would be spied by sinon.
          dispatchEvent(new Event('load'));

          // Testing load event done once.
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
            'Load - Analytics Tests Successfully Passed Search page block.'
          );
        }
      });
    });

    it('Testing Search autocomplete entity click', async () => {
      await page.type('input[name=search]', 'pens');
      // Wait for 2.5 sec until the dropdown data is fetched and loaded.
      await page.waitFor(2500);
      await page.evaluate(async () => {
        const $containers = await jQuery(
          '.search-api-autocomplete-search .ui-menu-item'
        );
        const $searchContainer = await jQuery(
          '#views-exposed-form-acquia-search-autocomplete-search-block'
        );
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Search autocomplete dropdown found.');
        } else {
          for (let index = 0; index < $containers.length; index++) {
            const $element = jQuery($containers[index]).find('a');

            var analyticsData = {
              event_name: 'feature_search_assist',
              event_entity: 'Feature',
              event_category: 'feature|search',
              event_action: 'search_assist',
              event_label:
                'search|' +
                jQuery.trim($searchContainer.find('#edit-search').val()) +
                ':' +
                jQuery.trim($element.text()),
              event_location: window.document.location.pathname,
            };

            // Triggering the click event, which would be spied by sinon.
            await $element.trigger('click');

            // Testing click event done once.
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
            'Load - Analytics Tests Successfully Passed Search page block.'
          );
        }
      });
    });

    it('Testing Original search link click', async () => {
      await page.goto(process.baseURL + '/search?search=pens');
      await includeSinon(page);
      await page.evaluate(async () => {
        const $containers = await jQuery('.results-string-container').find(
          '.original-search-link'
        );
        const spy = window.sinon.spy(window.utag, 'link');

        if ($containers.length === 0) {
          LogWarning('No Original search link found.');
        } else {
          const $element = $containers.find('a');

          var analyticsData = {
            event_name: 'feature_search_recommend',
            event_entity: 'Feature',
            event_category: 'feature|search',
            event_action: 'search_recommend',
            event_label: 'search|' + jQuery.trim($element.text()),
            event_location: window.document.location.pathname,
          };

          // Triggering the click event, which would be spied by sinon.
          await $element.trigger('click');

          // Testing click event done once.
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
            'Load - Analytics Tests Successfully Passed for Original search link.'
          );
        }
      });
    });
  },
  timeout
);
