const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

module.exports = async function generatorHTML(html) {
  try {
    const name = `${+new Date()}_html.html`;
    await writeFile(`./public/${name}`, html, 'utf8');
    return name;
  } catch (e) {
    console.log(e);
  }
};
