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

    it('Testing Main menu click', async () => {
      const data = await page.evaluate(async () => {
        const spy = window.sinon.spy(window.utag, 'link');
        const $container = jQuery('#block-newell-main-menu');
        if ($container.length === 0) {
          LogWarning('No Main menu block found.');
        } else {
          const $elements = jQuery($container[0]).find('a');
          for (
            let index = 0;
            index < $elements.length;
            index++
          ) {
            const $element = jQuery($elements[index]);
            let levels = $element
            .parents('li.menu-item')
            .map(function(i, item) {
              return jQuery(item)
                .children()
                .eq(0)
                .text()
                .trim();
            })
            .get()
            .reverse()
            .join('|');
            
            const analyticsData = {
              event_name: 'component_nav_expanded',
              event_entity: 'Component',
              event_category: 'components|Nav|' + (jQuery(window).width() < 1200 ? 'mobile' : 'desktop'),
              event_action: 'component_nav',
              event_label: 'component|' + levels,
              event_location: window.document.location.pathname,
            };

            // Triggering the click event to which would be spied by sinon.
            await $element.trigger('click');

            // Testing click event.
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
            'Click - Analytics Tests Successfully Passed for Main menu.'
          );
        }
        spy.restore();
      });
    });
  },
  timeout
);
