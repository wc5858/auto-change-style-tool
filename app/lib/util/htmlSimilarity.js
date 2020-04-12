const difflib = require('difflib');
const synonyms = require('synonyms');

const similarity = (dom1, dom2, k = 0.7) => {
  let cur = new Date();
  const s1 = structuralSimilarity(dom1.tagSequence, dom2.tagSequence);
  const time1 = new Date() - cur;
  cur = new Date();
  const s2 = styleSimilarity(dom1.classList, dom2.classList);
  const w1 = dom1.node.info.offsetWidth;
  const w2 = dom2.node.info.offsetWidth;
  const h1 = dom1.node.info.offsetHeight;
  const h2 = dom2.node.info.offsetHeight;
  let dw, dh;
  if (w1 === 0 && w2 ===0) {
    dw = 1;
  } else {
    dw = w1 > w2 ? (w1 - w2) / w1 : (w2 - w1) / w2;
  }
  if (h1 === 0 && h2 ===0) {
    dh = 1;
  } else {
    dh = h1 > h2 ? (h1 - h2) / h1 : (h2 - h1) / h2;
  }
  const d = 1 - (dw * 2 + dh) / 3;
  const time2 = new Date() - cur;
  return {
    s: k * (0.3 + 0.7 * d) * s1 + (1 - k) * s2,
    time1,
    time2
  };
};

const structuralSimilarity = (tags1, tags2) => {
  const s = new difflib.SequenceMatcher(null, tags1, tags2);
  return s.ratio();
};

const styleSimilarity = (classList1, classList2) => {
  // if (classList1.length == classList2.length) {
  //   console.log(classList1, classList2)
  // }
  const getWords = list => {
    const set = new Set();
    for (const i of list) {
      const words = i.split(/-|_/g);
      // TODO：分词需要优化
      // 情形1：topBar这种驼峰式写法（少见）
      // 情形2：topbar这种连写形式
      // 情形3：nav这种省略形式
      // 情形4：columns这种复数形式
      // 情形5：btn、sm、lg这种缩写形式
      // 其他还没留意到的情形
      for (const word of words) {
        if (word) {
          set.add(word);
          // 查找同义词库
          // const res = synonyms(word);
          // if (res && typeof res === 'object') {
          //   for (const j of Object.values(res)) {
          //     for (const k of j) {
          //       set.add(k);
          //     }
          //   }
          // } else {
          //   // console.log(res, word)
          // }
        }
      }
    }
    return set;
  };
  const set1 = getWords(classList1);
  const set2 = getWords(classList2);
  let common = 0;
  for (const i of set1.values()) {
    if (set2.has(i)) {
      common++;
    }
  }
  return common / (set1.size + set2.size - common);
};

module.exports = {
  similarity
};
