const browserify = require('browserify');

const bundleData = new Map();

// 将node模块处理成浏览器可解析的形式，并做缓存处理
module.exports = async function(bundle, name) {
  if (!name) {
    name = bundle;
    console.warn('bundle name required:' + bundle);
  }
  if (!bundleData.has(name)) {
    let b = browserify();
    b.require(bundle, { expose: name });
    //.pipe(process.stdout)
    let str = await new Promise(function(resolve, reject) {
      b.bundle((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.toString());
        }
      });
    });
    bundleData.set(name, str);
    console.log('bundle cached:' + bundle);
  }
  return bundleData.get(name);
};
