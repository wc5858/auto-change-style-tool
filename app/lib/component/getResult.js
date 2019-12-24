module.exports = async function(driver) {
  return await driver.executeScript(function() {
    return {
      bodyHTML: document.querySelector('body').innerHTML,
      style: document.querySelector('#style-merged-used-css').innerText
    };
  });
};
