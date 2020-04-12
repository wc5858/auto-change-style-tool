const getBundle = require('../util/getBundle');

// bgMappingType: area or times
module.exports = async function(driver, colorData, bgMappingType = 'area') {
  const bundle = getBundle('./app/lib/browser/util.js', 'util');

  // 传入styleData，在浏览器里执行脚本更换样式
  return await driver.executeScript(
    function() {
      const data = arguments[0];
      eval(data.bundle);
      const util = require('util');

      const originBgColorData = data.colorData.bgColor;
      const originFontColorData = data.colorData.fontColor;
      const cssData = {};
      const bgColorData = {};
      const fontColorData = {};
      const getCss = util.dealCss(cssData, bgColorData, fontColorData);
      let html = '<!DOCTYPE html><head><meta charset="utf-8"></head><body>';
      let all = document.getElementsByTagName('*');
      for (let k = 0; k < all.length; k++) {
        getCss(all[k]);
      }

      let totalArea = 0;
      let totalTimes = 0;
      for (let i in bgColorData) {
        totalArea += bgColorData[i].area;
        totalTimes += bgColorData[i].times;
      }
      for (let i in bgColorData) {
        bgColorData[i].areaRatio = bgColorData[i].area / totalArea;
        bgColorData[i].timesRatio = bgColorData[i].area / totalTimes;
      }
      
      let totalLength = 0;
      for (let i in fontColorData) {
        totalLength += fontColorData[i].length;
      }
      for (let i in fontColorData) {
        fontColorData[i].lengthRatio = fontColorData[i].length / totalLength;
      }

      const HIGH = 0.2;
      const MID = 0.05;

      const analysisBgColor = data => {
        let colors = {
          area: {
            high: [],
            mid: [],
            low: []
          },
          times: {
            high: [],
            mid: [],
            low: []
          }
        };
        for (let i in data) {
          if (data.hasOwnProperty(i)) {
            colors.area[
              data[i].areaRatio > HIGH
                ? 'high'
                : data[i].areaRatio > MID ? 'mid' : 'low'
            ].push(i);
            colors.times[
              data[i].timesRatio > HIGH
                ? 'high'
                : data[i].timesRatio > MID ? 'mid' : 'low'
            ].push(i);
          }
        }
        return colors;
      }

      const analysisFontColor = data => {
        let colors = {
          length: {
            high: [],
            mid: [],
            low: []
          }
        };
        for (let i in data) {
          if (data.hasOwnProperty(i)) {
            colors.length[
              data[i].lengthRatio > HIGH
                ? 'high'
                : data[i].lengthRatio > MID ? 'mid' : 'low'
            ].push(i);
          }
        }
        return colors;
      }

      const originBgColors = analysisBgColor(originBgColorData);
      const originFontColors = analysisFontColor(originFontColorData);

      const bgMappingType = data.bgMappingType;
      const fontMmappingType = 'length';
      // TODO：这边还有一些硬编码，可以优化下
      const establishMapping = () => {
        for (let i in bgColorData) {
          const ratio = bgColorData[i][`${bgMappingType}Ratio`];
          let source = originBgColors[bgMappingType][ratio > HIGH ? 'high' : ratio > MID ? 'mid' : 'low'];
          bgColorData[i].mappedColor = source[Math.floor(Math.random() * source.length)];
        }
        for (let i in fontColorData) {
          const ratio = fontColorData[i][`${fontMmappingType}Ratio`];
          const source = originFontColors[fontMmappingType][ratio > HIGH ? 'high' : ratio > MID ? 'mid' : 'low'];
          fontColorData[i].mappedColor = source[Math.floor(Math.random() * source.length)];
        }
      }
      establishMapping();

      // console.log(bgColorData);

      // util.addCss(document.body);
      // 对每个元素都进行处理
      for (let k = 0; k < all.length; k++) {
        util.replaceColor(all[k], bgColorData, fontColorData);
      }
      // html += document.body.outerHTML + '</body></html>';
      // location.href = 'about:blank';
      // document.write(html);
      return html;
    },
    {
      colorData,
      bundle,
      bgMappingType
    }
  );
};
