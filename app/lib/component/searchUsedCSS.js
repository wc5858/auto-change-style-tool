const getBundle = require('../util/getBundle');

module.exports = async function(driver) {
  // 载入util，做browserify处理
  const bundle = getBundle('./app/lib/browser/css-used/index.js', 'getC');

  const cur = +new Date();
  await driver.executeScript(bundle);
  await driver.executeAsyncScript(function() {
    const callback = arguments[arguments.length - 1];
    const getUsedCSS = require('getC');
    (async function() {
      const doms = [...document.querySelectorAll('*')];
      for (const dom of doms) {
        // if (dom.tagName && dom.tagName === 'SVG') {
        //   continue;
        // }
        // const cur = + new Date();
        const res = await getUsedCSS(dom, false);
        if (res.success && res.css) {
          dom.setAttribute('data-used-css', res.css);
        }
        // console.log( + new Date() - cur, dom.tagName, `${doms.indexOf(dom)} / ${doms.length}`);
      }
    })().then(callback);
  });
  // total cost: 45169 (github.com)
  console.log(`total cost: ${new Date() - cur}`);
  // 这里要执行异步脚本
  return;
};
