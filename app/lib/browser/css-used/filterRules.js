/* global chrome */

// this module is used to filter rules
// by testing the dom and its children one by one.
// each testing is wrapped by a settimeout timmer to make it async
// because the testing can be a long time if too many.

const debugMode = process.env.NODE_ENV !== 'production';
const cssHelper = require('./cssHelper');

// may match accoding to interaction
const PseudoClass =
    '((-(webkit|moz|ms|o)-)?(full-screen|fullscreen))|-o-prefocus|active|checked|disabled|empty|enabled|focus|hover|in-range|invalid|link|out-of-range|target|valid|visited',
  PseudoElement =
    '((-(webkit|moz|ms|o)-)?(focus-inner|input-placeholder|placeholder|selection|resizer|scrollbar(-(button|thumb|corner|track(-piece)?))?))|-ms-(clear|reveal|expand)|-moz-(focusring)|-webkit-(details-marker)|after|before|first-letter|first-line',
  MaxPossiblePseudoLength = 30,
  REG0 = new RegExp(
    '^(:(' + PseudoClass + ')|::?(' + PseudoElement + '))+$',
    ''
  ),
  REG1 = new RegExp(
    '( |^)(:(' + PseudoClass + ')|::?(' + PseudoElement + '))+( |$)',
    'ig'
  ),
  REG2 = new RegExp(
    '\\((:(' + PseudoClass + ')|::?(' + PseudoElement + '))+\\)',
    'ig'
  ),
  REG3 = new RegExp(
    '(:(' + PseudoClass + ')|::?(' + PseudoElement + '))+',
    'ig'
  );

const filterRules = ($0, objCss, getInnerStyle) => {
  const keyFramUsed = [];
  const fontFaceUsed = [];

  const resArr = objCss.normRule.map(rule => {
    if (typeof rule === 'string') {
      return rule;
    } else {
      const selMatched = [];
      const arrSel = [...rule.selectors];
      arrSel.forEach(function(sel) {
        if (selMatched.indexOf(sel) !== -1) {
          return;
        }
        // these pseudo class/elements can apply to any ele
        // but wont apply now
        // eg. :active{xxx}
        // only works when clicked on and actived
        if (sel.length < MaxPossiblePseudoLength && sel.match(REG0)) {
          selMatched.push(sel);
        } else {
          const count = [];
          const replacedSel = sel
            .replace(REG1, ' * ')
            .replace(REG2, '(*)')
            .replace(REG3, '');
          try {
            if (
              $0.matches(replacedSel) ||
              (getInnerStyle && $0.querySelectorAll(replacedSel).length !== 0)
            ) {
              selMatched.push(sel);
            }
          } catch (e) {
            count.push(replacedSel);
            count.push(e);
          }
          if (count.length === 4 && debugMode) {
            if (count[2] === count[0]) {
              count = count.slice(0, 2);
            }
            console.log(count);
          }
        }
      });
      if (selMatched.length !== 0) {
        var cssText = selMatched.join(',');
        cssText += '{' + cssHelper.normRuleNodeToText(rule) + '}';
        rule.nodes.forEach(function(ele, idx) {
          if (
            ele.prop &&
            ele.prop.match(/^(-(webkit|moz|ms|o)-)?animation(-name)?$/i) !==
              null
          ) {
            // 原代码中判断keyframes的方法是有问题的
            keyFramUsed.push(
              ...ele.value.split(/ *, */).map(i => i.split(' ').pop())
            );
          }
        });
        let fontfamilyOfRule = cssHelper.textToCss(cssText);
        if (
          fontfamilyOfRule.cssRules[0] &&
          fontfamilyOfRule.cssRules[0].style.fontFamily
        ) {
          fontFaceUsed.push(
            ...fontfamilyOfRule.cssRules[0].style.fontFamily.split(', ')
          );
        }
        return cssText;
      }
    }
    return '';
  });

  const matched = resArr.filter(ele => ele.length);

  let frameCommentMarkUsed = false;
  keyFramUsed.forEach(function(ele) {
    objCss.keyFram.forEach(function(e) {
      if (ele === e.params) {
        if (!frameCommentMarkUsed) {
          matched.push('/*! CSS Used keyframes */');
          frameCommentMarkUsed = true;
        }
        matched.push(cssHelper.keyFramNodeToText(e));
      }
    });
  });
  let fontCommentMarkUsed = false;
  fontFaceUsed.forEach(function(ele) {
    objCss.fontFace.forEach(function(e) {
      e.nodes.forEach(function(n) {
        if (
          n.prop === 'font-family' &&
          ele.replace(/^(['"])?(.*)\1$/, '$2') ===
            n.value.replace(/^(['"])?(.*)\1$/, '$2')
        ) {
          if (!fontCommentMarkUsed) {
            matched.push('/*! CSS Used fontfaces */');
            fontCommentMarkUsed = true;
          }
          matched.push(cssHelper.fontFaceNodeToText(e));
        }
      });
    });
  });

  return matched;
};

module.exports = filterRules;
