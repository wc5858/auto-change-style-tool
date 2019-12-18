const fs = require('fs');
const util = require('util');
const sharp = require('sharp');
const writeFile = util.promisify(fs.writeFile);

// 滚动截图
module.exports = async function(name, driver) {
  const scrollHeight = await driver.executeScript(
    () => document.body.scrollHeight
  );
  const windowSize = await driver
    .manage()
    .window()
    .getRect();
  const windowHeight = windowSize.height;
  let position = 0;
  const buffers = [];
  while (position < scrollHeight) {
    await driver.executeScript(function() {
      const position = arguments[0];
      window.scrollTo(0, position);
    }, position);
    const imgData = await driver.takeScreenshot();
    const top =
      position + windowHeight > scrollHeight
        ? scrollHeight - (windowHeight + position - scrollHeight)
        : position;
    buffers.push({
      input: new Buffer(imgData, 'base64'),
      left: 0,
      top
    });
    position += windowHeight;
  }
  const outputBuffer = await sharp({
    create: {
      width: windowSize.width,
      height: scrollHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0 }
    }
  })
    .composite(buffers)
    .png()
    .toBuffer();
  const file = `./public/${name}.png`;
  await writeFile(file, outputBuffer);
  return file;
};
