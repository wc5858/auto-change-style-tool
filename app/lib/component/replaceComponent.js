const seg = require('./segmentation');
const { rebuildHTML } = require('../util/domTree');
const { getLeafComponent } = require('../util/component');
const generatorHTML = require('../util/generatorHTML');
const { similarity } = require('../util/htmlSimilarity');

const searchNodeContents = node => {
  const satck = [node];
  const contents = {
    texts: [],
    imgs: []
  };
  while (satck.length > 0) {
    let cur = satck.pop();
    if (cur.type === 'text' && cur.content) {
      contents.texts.push(cur.content);
      continue;
    }
    if (!cur.info) {
      continue;
    }
    if (cur.info.tag === 'IMG') {
      contents.imgs.push({
        src: cur.info.src,
        width: cur.info.css.width,
        height: cur.info.css.height
      });
      continue;
    }
    if (cur.children) {
      satck.push(...cur.children);
    }
  }
  return contents;
};
const replaceNodeContents = (node, source) => {
  const satck = [node];
  while (satck.length > 0) {
    let cur = satck.pop();
    if (!cur.info) {
      continue;
    }
    if (cur.children) {
      satck.push(...cur.children);
    } else {
      if (cur.type === 'text') {
        cur.content = source.texts.shift() || '';
        continue;
      }
      if (!cur.info) {
        continue;
      }
      if (cur.info.tag === 'IMG') {
        const img = source.imgs.shift();
        cur.info.src = img.src || '';
        cur.info.css.width = img.width || '';
        cur.info.css.height = img.height || '';
        // 取消最大最小宽高度限制
        cur.info.css['max-width'] = 'none';
        cur.info.css['max-height'] = 'none';
        continue;
      }
    }
  }
  return node;
};

module.exports = async function(
  driver,
  data,
  options = { threshold1: 0.45, threshold2: 0.3, pac: 5 }
) {
  let node = await seg(driver, {
    pac: options.pac,
    returnType: 'wprima',
    showBox: false
  });
  const list = getLeafComponent(node);
  const map = {};
  const maxs = [];
  let sum1 = 0;
  let sum2 = 0;
  for (const i of list) {
    let max = 0;
    for (const j of data) {
      const { s: score, time1, time2 } = similarity(i, j);
      sum1 += time1;
      sum2 += time2;
      if (score > max) {
        max = score;
        i.similarity = j;
      }
      // 找到合适的就不再继续查找
      if (max >= options.threshold1) {
        break;
      }
    }
    maxs.push(max);
    // 找到匹配项大于这个阈值时才执行替换
    if (max >= options.threshold2) {
      // 执行一次深拷贝
      const copyNode = JSON.parse(JSON.stringify(i.similarity.node));
      map[i.node.id] = replaceNodeContents(
        copyNode,
        searchNodeContents(i.node)
      );
    }
  }

  console.log(sum1,sum2);

  const usedId = [];

  const replaceNode = node => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const element = node.children[i];
        if (element.id && map[element.id]) {
          usedId.push(element.id);
          node.children[i] = map[element.id];
        } else {
          replaceNode(element);
        }
      }
    }
  };

  replaceNode(node);

  let html = '<!DOCTYPE html><head><meta charset="utf-8"></head>';
  html += rebuildHTML(node) + '</html>';

  const name = await generatorHTML(html);

  await driver.get(`http://localhost:7001/public/${name}`);

  // 如果直接传入html文件，会出现问题，可能是字符串太长了
  // await driver.executeScript(function() {
  //   var html = arguments[0];
  //   alert(1)
  //   console.log(html)
  //   document.write(html);
  // }, html);
  await driver.executeScript(function() {
    document.body.style['overflow-x'] = 'hidden';
  });
};
