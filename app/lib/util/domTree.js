const getCss = node => {
  let css = {};
  let cs = getComputedStyle(node);
  for (const i of cs) {
    css[i] = cs.getPropertyValue(i);
  }
  return css;
};

const mergeCss = css => {
  let cssString = '';
  for (const i in css) {
    if (css.hasOwnProperty(i)) {
      cssString += `${i}:${css[i]};`;
    }
  }
  return cssString;
};

const getNodeInfo = node => {
  const data = {
    bomtype: node.getAttribute('bomtype') || null,
    pre: node.getAttribute('parent'),
    style: node.getAttribute('style'),
    isBlock: node.getAttribute('data-is-block') === '1',
    id: node.getAttribute('id'),
    offsetWidth: node.offsetWidth,
    offsetHeight: node.offsetHeight,
    scrollWidth: node.scrollWidth,
    scrollHeight: node.scrollHeight,
    offsetLeft: node.offsetLeft,
    offsetTop: node.offsetTop,
    css: getCss(node),
    tag: node.tagName,
    class: node.classList.value.split(' '),
    usedCss: node.getAttribute('data-used-css') || null
  };
  if (data.tag.toLowerCase() == 'img') {
    data.src = node.currentSrc;
  }
  return data;
};

const nodeFactory = options => {
  return Object.assign(
    {
      // children: []
    },
    options || {}
  );
};

const isExcluded = node => {
  const excludeList = [
    'SCRIPT',
    'STYLE',
    'AREA',
    'HEAD',
    'META',
    'FRAME',
    'FRAMESET',
    'BR',
    'HR',
    'NOSCRIPT'
  ];
  return node ? excludeList.includes(node.tagName.toUpperCase() || node.localName.toUpperCase()) : false;
};

const isText = node => {
  // Node是浏览器环境的全局对象
  return node ? node.nodeType == (Node.TEXT_NODE || 3) : false;
};

const isElement = node => {
  return node ? node.nodeType == (Node.ELEMENT_NODE || 1) : false;
};

const mergeChildren = tmp => {
  const children = [];
  let text = '';
  for (let i of tmp) {
    if (typeof i == 'string') {
      text += i;
    } else {
      if (text) {
        children.push(text, i);
        text = '';
      } else {
        children.push(i);
      }
    }
  }
  if (text) {
    children.push(text);
  }
  return children;
};

const createTree = domNode => {
  if (!domNode) {
    return null;
  }
  if (isText(domNode)) {
    if (!domNode.textContent || domNode.textContent.trim() == '') {
      return null;
    }
    return domNode.textContent || null;
  }
  if (isElement(domNode)) {
    if (isExcluded(domNode)) {
      return null;
    }
    const node = nodeFactory({
      info: getNodeInfo(domNode)
    });
    let children = [];
    for (const element of domNode.childNodes) {
      const i = createTree(element);
      if (i) {
        children.push(i);
      }
    }
    // 合并连续text节点
    children = mergeChildren(children);
    if (children.length == 0) {
      if (node.info.offsetWidth * node.info.offsetHeight) {
        node.type = 'empty';
      } else {
        if (!['path', 'g'].includes(node.info.tag.toLowerCase())) {
          return null;
        }
      }
      node.type = 'empty';
    } else if (children.length == 1 && typeof children[0] == 'string') {
      node.type = 'text';
      node.content = children[0];
    } else {
      node.children = children;
    }

    if (domNode.tagName.toLowerCase() === 'svg') {
      node.type = 'svg';
      node.selfHTML = domNode.outerHTML;
    }
    
    if (domNode.tagName.toLowerCase() == 'input' && (domNode.getAttribute('type') === 'submit' || domNode.getAttribute('type') === 'button')) {
      node.info.tag = 'BUTTON';
      node.children = null;
      node.content = domNode.getAttribute('value');
    }
    // if (domNode.tagName.toLowerCase() == 'input') {
    //   node.inputType = domNode.getAttribute('type');
    //   node.inputValue = domNode.getAttribute('value');
    // }
    return node;
  }
  return null;
};

const rebuildHTML = (treeNode, isReplaced) => {
  if (!treeNode) {
    return '';
  }
  if (typeof treeNode == 'string') {
    return treeNode;
  }
  if (!treeNode.info) {
    return '';
  }
  if (treeNode.type === 'svg') {
    return treeNode.selfHTML;
  }
  let innerHTML = treeNode.children
    ? treeNode.children.reduce((pre, cur) => pre + rebuildHTML(cur, treeNode.isReplaced), '')
    : treeNode.content
      ? treeNode.content
      : '';
  const tag = treeNode.info.tag;

  const style = treeNode.isReplaced || isReplaced ? mergeCss(treeNode.info.css) : treeNode.info.style;
  // const style = mergeCss(treeNode.info.css);
  const res = `<${tag} class="${treeNode.info.class.join(' ')}" parent="${treeNode.info.pre}" ${
    tag == 'IMG' ? `src="${treeNode.info.src}"` : ''
  } ${treeNode.id ? `data-id="${treeNode.id}"` : ''} ${
    treeNode.isReplaced ? 'data-replaced="1"' : ''
  } style='${style}' data-used-css='${treeNode.info.usedCss}' ${treeNode.info.id ? `id=${treeNode.info.id}` : ''} 
    >${innerHTML}</${tag}>`;
    
  // ${treeNode.inputType ? `type=${treeNode.inputType}` : ''} ${treeNode.inputValue ? `type=${treeNode.inputValue}` : ''}
  // if (res.indexOf('button<') >= 0) {
  //   console.log(tag)
  // }
  return res;
};

module.exports = {
  createTree,
  rebuildHTML
};
