const timeout = 15000;
const chalk = require('chalk');

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
      await page.addScriptTag({
        url:
          'https://cdnjs.cloudflare.com/ajax/libs/sinon.js/7.2.3/sinon.min.js',
      });
      await page.exposeFunction('LogSuccess', data => {
        return console.log(chalk.green(data));
      });
      await page.exposeFunction('LogCurrentStatus', data => {
        return console.log(chalk.yellow(data));
      });
      page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i) console.log(`${msg.args[i]}`);
      });
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('Testing analytics click event without error', async () => {
      const data = await page.evaluate(async () => {
        const $containers = jQuery('.hero');
        const $wrapper = jQuery($containers[0]).find('.slick-active');
        const $element = $wrapper.find('.hero-slide');
        const elementData = $element.data();
        const analyticsData = {
          event_name: 'promo_click_hero-carousel',
          event_entity: 'Promotion',
          event_category: 'promotions|' + elementData.bannerName,
          event_action: 'promo_click',
          event_label: 'promotions|' + elementData.campaignName,
          event_location: window.document.location.pathname,
          promo_click_name: 'component|' + elementData.bannerName,
          promo_click_position: 'component|' + ($wrapper.data().slickIndex + 1),
          promo_click_creative:
            drupalSettings.newell.page_name + ' hero carousel',
        };
        const spy = window.sinon.spy(window.utag, 'link');

        // Triggering the click event to which would be spied by sinon.
        await $element.trigger('click');

        // Testing click event only done once.
        LogCurrentStatus('Testing - Only one click on the element.');
        sinon.assert.calledOnce(spy);
        LogSuccess('Success');

        // Verifying each entity of the analytics payload object.
        for (let i in analyticsData) {
          LogCurrentStatus(`Testing analyticsObject key - ${i}`);
          sinon.assert.calledWith(spy, sinon.match({ [i]: analyticsData[i] }));
          LogSuccess('Success');
        }

        LogSuccess('Analytics Tests Successfully Passed for Hero');
      });
    });
  },
  timeout
);
