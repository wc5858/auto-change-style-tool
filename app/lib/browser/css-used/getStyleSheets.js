const convUrlToAbs = require('./convUrlToAbs');

const searchAllStyleSheets = document => {
  const res = [];
  const search = styleSheet => {
    let rules;
    // 在某些特殊情形下，该css表会被CORS机制ban掉
    // update @2020/1/2: 已从driver层面绕过该限制
    try {
      rules = styleSheet.cssRules;
    } catch {
      return;
    }
    res.push(styleSheet);
    [...rules].forEach(cssRule => {
      if (cssRule instanceof CSSImportRule) {
        search(cssRule.styleSheet);
      }
    });
  };
  [...document.styleSheets].forEach(search);
  return res;
};

const getStyleSheets = document =>
  searchAllStyleSheets(document).map(i => ({
    cssraw: [...i.cssRules]
      .reduce((pre, cur) => pre + '\n' + cur.cssText, '')
      .replace(
        /url\((['"]?)(.*?)\1\)/g,
        (a, p1, p2) => `url(${convUrlToAbs(document.location.href, p2)})`
      ),
    href: i.href || document.location.href, // 内联样式表没有href属性
    media: i.ownerRule ? i.ownerRule.media : i.media
  }));

module.exports = getStyleSheets;
