const version = '0.0.1';
const getCommonAttrs = node => {
  const res = {};
  if (node.info.css.display === 'none' || node.info.css.visibility === 'hidden') {
    // 默认为true
    res.visible = false;
  }
  if (node.type === 'empty') {
    res.empty = true;
  }
  return res;
};
const rules = [
  {
    name: 'Input',
    match: node => {
      if (node.info.tag.toLowerCase() === 'input') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {
      };
    }
  },
  {
    name: 'Button',
    match: node => {
      if (node.info.tag.toLowerCase() === 'button') {
        return true;
      }
      if (node.info.tag.toLowerCase() === 'a') {
        if (node.info.class.some(i => i.includes('btn') || i.includes('button'))) {
          return true;
        }
      }
      return false;
    },
    getAttrs: node => {
      const w = node.info.offsetWidth;
      const h = node.info.offsetHeight;
      return {
        width: w > 5 * h ? 'long' : w > 3 * h ? 'mid' : 'short'
      };
    }
  },
  {
    name: 'Title',
    match: node => {
      if (['h1','h2','h3','h4','h5','h6'].includes(node.info.tag.toLowerCase())) {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {
        level: +node.info.tag.toLowerCase()[1]
      };
    }
  },
  {
    name: 'Paragraph',
    match: node => {
      if (node.info.tag.toLowerCase() === 'p') {
        return true;
      }
      if (node.info.tag.toLowerCase() === 'div') {
        if (node.type === 'text' ) {
          return true;
        }
      }
      return false;
    },
    getAttrs: node => {
      const res = {};
      if (node.info.tag.toLowerCase() === 'p') {
        res.originTag = 'p';
      }
      if (node.info.tag.toLowerCase() === 'div') {
        if (node.type === 'text' ) {
          res.originTag = 'div';
          res.simple = true;
        }
      }
      return res;
    }
  },
  {
    name: 'Code',
    match: node => {
      if (node.info.tag.toLowerCase() === 'code') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {};
    }
  },
  {
    name: 'Text',
    match: node => {
      if (node.info.tag.toLowerCase() === 'span') {
        return true;
      }
      if (node.info.tag.toLowerCase() === 'strong') {
        return true;
      }
      // if (node.info.tag.toLowerCase() === 'div') {
      //   if (node.type === 'text' ) {
      //     return true;
      //   }
      //   return true;
      // }
      return false;
    },
    getAttrs: node => {
      const res = {}
      if (node.info.tag.toLowerCase() === 'strong') {
        res.type = 'emphasize';
      }
      return res;
    }
  },
  {
    name: 'Link',
    match: node => {
      if (node.info.tag.toLowerCase() === 'a') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {
        display: node.info.css.display
      };
    }
  },
  {
    name: 'List',
    match: node => {
      if (node.info.tag.toLowerCase() === 'ul') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {};
    }
  },
  {
    name: 'OrderedList',
    match: node => {
      if (node.info.tag.toLowerCase() === 'ol') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {};
    }
  },
  {
    name: 'ListItem',
    match: node => {
      if (node.info.tag.toLowerCase() === 'li') {
        return true;
      }
      return false;
    },
    getAttrs: node => {
      return {};
    }
  },
  {
    name: 'Block',
    match: node => {
      return true;
    },
    getAttrs: node => {
      return {
        blockTag: node.info.tag.toLowerCase()
      };
    }
  }
];
const getRuleTree = (node, info) => {
  if (typeof node === 'string') {
    return {
      name: 'Text',
      attrs: {},
      children: []
    };
  }
  const matchedRule = rules.find(element => element.match(node));
  const res = {
    name: matchedRule.name,
    attrs: Object.assign(getCommonAttrs(node), matchedRule.getAttrs(node)),
    children: []
  };
  const childrens = [];
  if (node.children && node.children.length > 0) {
    let last = -1;
    let lastClassName = '';
    let lastTagName = '';
    node.children.forEach(element => {
      if (element.info) {
        if (element.info.tag === lastTagName) {
          const firstClass = element.info.class[0];
          if (!firstClass || firstClass === lastClassName) {
            childrens[last].push(element);
            return;
          }
        }
        last += 1;
        childrens[last] = [element];
        lastTagName = element.info.tag;
        lastClassName = element.info.class[0] || '';
      } else {
        lastClassName = '';
        lastTagName = '';
      }
    });
    childrens.forEach(element => {
      if (element.length > 1) {
        res.children.push({
          name: 'Repeatable',
          attrs: {},
          children: [getRuleTree(element[0], info)]
        });
        node.isRepeatable = true;
        if (info) {
          info.hasRepeatable = true;
        }
      } else {
        element.forEach(i => {
          res.children.push(getRuleTree(i, info))
        });
      }
    });
  }
  if (res.name === 'Paragraph' && res.children.length > 2) {
    const set = new Set();
    res.children.forEach(i => set.add(JSON.stringify(i)));
    res.children = [{
      name: 'OptionalComponents',
      attrs: {},
      children: [...set].map(JSON.parse)
    }];
    if (info) {
      info.hasOptionalComponents = true;
    }
  }
  return res;
};
const buildText = ruleTree => {
  let res = '';
  const helper = (node, indentation) => {
    res += `\n${'\u00A0'.repeat(indentation)}<${node.name}`;
    Object.entries(node.attrs).forEach(([key, val]) => {
      res += ` ${key}="${val}"`;
    });
    if (node.children.length > 0) {
      res += '>';
      node.children.forEach(i => helper(i, indentation + 4));
      res += `\n${'\u00A0'.repeat(indentation)}</${node.name}>`;
    } else {
      res += ' />';
    }
  }
  helper(ruleTree, 0);
  return res;
};
const simplifyRuleTree = (node, parent, idx) => {
  if (node.children.length === 1) {
    const child = node.children[0];
    if (child.name !== 'Repeatable' && child.name !== 'OptionalComponents' && child.children.length > 0) {
      Object.assign(node.attrs, child.attrs);
      node.attrs.wrapper = child.name;
      node.children = child.children;
    }
  }
  node.children.forEach((i, idx) => simplifyRuleTree(i, node, idx));
};

module.exports = {
  version,
  getRuleTree,
  buildText,
  simplifyRuleTree
};