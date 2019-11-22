const { createBucket } = require('mongoose-gridfs');
const Readable = require('stream').Readable;
const Service = require('egg').Service;
const toString = require('stream-to-string');

const attachmentPromise = (stream, name) => {
  return new Promise((resolve, reject) => {
    const bucket = createBucket({ bucketName: 'fs' });
    bucket.writeFile(
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
  async read(filename) {
    const attachment = createBucket({ bucketName: 'fs' });
    const readStream = attachment.readFile({ filename });

    return await toString(readStream);
  }
}

module.exports = FsSevice;
