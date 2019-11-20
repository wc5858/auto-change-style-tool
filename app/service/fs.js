const { createModel } = require('mongoose-gridfs');
const Readable = require('stream').Readable;
const Service = require('egg').Service;
const toString = require('stream-to-string');

const attachmentPromise = (stream, name) => {
  const attachment = createModel();
  return new Promise((resolve, reject) => {
    attachment.write(
      { filename: `${name}.txt`, contentType: 'text/plain' },
      stream,
      (error, file) => {
        if (error) {
          reject(error);
        } else {
          resolve(file);
        }
      }
    );
  });
};

class FsSevice extends Service {
  async write(string, name) {
    const s = new Readable();
    s.push(string);
    s.push(null);

    return await attachmentPromise(s, name);
  }
  async read(_id) {
    const attachment = createModel();
    const readStream = attachment.read({ _id });

    return await toString(readStream);
  }
}

module.exports = FsSevice;
