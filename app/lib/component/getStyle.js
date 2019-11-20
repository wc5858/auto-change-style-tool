const getBundle = require('../util/getBundle');

module.exports = async function(driver, returnType = 'mutidata') {
  // 载入util，做browserify处理
  const bundle = getBundle('./app/lib/browser/util.js', 'util');

  return await driver.executeScript(
    function() {
      let data = arguments[0];
      eval(data.bundle);
      let util = require('util');
      let cssData = {};
      let bgColorData = {};
      let fontColorData = {};
      // getCss是dealCss返回的函数
      const getCss = util.dealCss(cssData, bgColorData, fontColorData);

      let html = '<!DOCTYPE html><head><meta charset="utf-8"></head><body>';

      // 把CSS信息添加到对应元素上
      const addCSS = function(el) {
        if (!el.hasAttribute('css_added')) {
          el.setAttribute('style', getCss(el));
        }
        el.setAttribute('css_added', 'true');
      };
      addCSS(document.body);
      let all = document.body.getElementsByTagName('*');
      for (let k = 0; k < all.length; k++) {
        addCSS(all[k]);
      }
      html += document.body.outerHTML + '</body></html>';
      for (let k in cssData) {
        cssData[k] = [...cssData[k]];
      }
      switch (data.returnType) {
        // 返回结构化的css数据，或者返回抽取附带样式信息的html文本
        case 'cssdata':
          return JSON.stringify(cssData);
        case 'colordata':
          return JSON.stringify({ bgColorData, fontColorData });
        case 'mutidata':
          return JSON.stringify({ cssData, bgColorData, fontColorData });
        case 'html':
          return html;
      }
    },
    {
      returnType,
      bundle
    }
  );
};
