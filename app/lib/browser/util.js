const getCssAttr = (value, type) => {
  let exp;
  switch (type) {
    case 'px':
      exp = /^(.+)px$/;
      break;
    case 'color':
      exp = /^rgb\((.+)\)$/;
      break;
  }
  if (exp) {
    const res = exp.exec(value);
    if (res) {
      return res[1];
    }
  }
  return '';
}

const getCss = el => {
  let lcss = '';
  let cs = getComputedStyle(el);
  //if(el.localName == 'html' || el.localName =='body'){
  for (let k = 0; k < cs.length; k++) {
    const at = cs.item(k);
    lcss += at + ':' + cs.getPropertyValue(at) + ';';
  }
  return lcss;
  //}
  // let body = document.getElementsByTagName('body')[0]
  // let sameTagEl = document.createElement(el.localName)
  // body.appendChild(sameTagEl)
  // let ds = getComputedStyle(sameTagEl)
  // for (let k = 0; k < cs.length; k++) {
  //     const at = cs.item(k)
  //     const value = cs.getPropertyValue(at)
  //     if (value != ds.getPropertyValue(at)) {
  //         lcss += at + ":" + value + ";"
  //     }
  // }
  // body.removeChild(sameTagEl)
  // return lcss
}

const addCss = (el, css) => {
  let c = css || getCss(el);
  if (!el.hasAttribute('css_added')) {
    el.setAttribute('style', c);
  }
  el.setAttribute('css_added', 'true');
}

const replaceColor = (el, bgColorData, fontColorData) => {
  let css = getCss(el);
  let bgColor = /background-color\:rgb\(([^\)]+)/.exec(css);
  let fontColor = /color\:rgb\(([^\)]+)/.exec(css);
  if (bgColor && bgColorData.hasOwnProperty(bgColor[1])) {
    // css = css.replace(
    //   /(background-color\:rgb\()([^\)]+)/,
    //   '$1' + bgColorData[bgColor[1]].mappedColor
    // );
    if (bgColorData[bgColor[1]].mappedColor) {
      el.style.backgroundColor = `rgb(${bgColorData[bgColor[1]].mappedColor})`;
    }
  }
  if (fontColor && fontColorData.hasOwnProperty(fontColor[1])) {
    // css = css.replace(
    //   /(color\:rgb\()([^\)]+)/,
    //   '$1' + fontColorData[fontColor[1]].mappedColor
    // );
    if (fontColorData[fontColor[1]].mappedColor) {
      el.style.color = `rgb(${fontColorData[fontColor[1]].mappedColor})`;
    }
  }
  // addCss(el, css);
}

const isText = node => node ? node.nodeType === (Node.TEXT_NODE || 3) : false;

const dealCss = (cssData, bgColorData, fontColorData) => {
  const addCssData = (tag, lcss) => {
    if (cssData[tag] == undefined) {
      cssData[tag] = new Set();
    }
    cssData[tag].add(lcss);
  }
  const addColorData = (width, height, color) => {
    if (width && height && color) {
      if (bgColorData[color]) {
        bgColorData[color].area += width * height;
        bgColorData[color].times += 1;
      } else {
        bgColorData[color] = {
          area: width * height,
          times: 1
        };
      }
    }
  }
  const addFontData = (el, fontColor) => {
    for (let i = 0; i < el.childNodes.length; i++) {
      // 这样处理是因为会有如下情形：<p>...<a>链接</a>...</p>
      // 此时链接内颜色会与p标签颜色不同，而text节点颜色则由p标签决定
      const element = el.childNodes[i];
      if(isText(element)) {
        if (fontColorData[fontColor]) {
          fontColorData[fontColor].lengh += element.textContent.length;
        } else {
          fontColorData[fontColor] = {
            length: element.textContent.length
          };
        }
      }
    }
  }
  // 获取CSS信息，这里做了柯里化
  return function getCss(el) {
    let lcss = '';
    let cs = getComputedStyle(el);
    let body = document.getElementsByTagName('body')[0];
    // console.log(el, el.localName )
    let sameTagEl = document.createElement(el.localName);
    body.appendChild(sameTagEl);
    let ds = getComputedStyle(sameTagEl);
    let width, height, color, fontColor;
    for (let k = 0; k < cs.length; k++) {
      const at = cs.item(k);
      const value = cs.getPropertyValue(at);
      // 针对个别属性取数据
      if (at == 'height') {
        height = getCssAttr(value, 'px');
      }
      if (at == 'width') {
        width = getCssAttr(value, 'px');
      }
      if (at == 'background-color') {
        color = getCssAttr(value, 'color');
      }

      if (at == 'color') {
        fontColor = getCssAttr(value, 'color');
      }

      if (value != ds.getPropertyValue(at)) {
        lcss += at + ':' + value + ';';
      }
    }

    addColorData(width, height, color);
    addCssData(el.localName, lcss);
    addFontData(el, fontColor);
    body.removeChild(sameTagEl);
    return lcss;
  };
}

module.exports = {
  getCssAttr,
  dealCss,
  addCss,
  replaceColor
};
