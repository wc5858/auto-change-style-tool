const WebSocket = require('ws');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

module.exports = async function (imgFile) {
  const ws = new WebSocket('wss://interfacemetrics.aalto.fi/metric');
  const img = await readFile(imgFile);
  const imgBase64 = img.toString('base64');
  let timeOut;
  const res = {};
  return new Promise((resolve, reject) => {
    ws.on('open', function () {
      console.log('--socket open--')
      ws.send(JSON.stringify({
        type: 'execute',
        url: '',
        data: `data:image/png;base64,${imgBase64}`,
        filename: imgFile.split('/').pop(),
        metrics: {
          cp2: true,
          cp3: true,
          cp4: true,
          cp5: true,
          cp6: true,
          cp7: true,
          cp8: true,
          cp9: true,
          cp10: true,
          pf1: true,
          pf2: true,
          pf5: true,
          pf7: true,
          pf8: true
        }
      }));
      timeOut = setTimeout(() => {
        ws.close();
        resolve(res);
      }, 600000)
    });

    const quit = () => {
      resolve(res);
      ws.close();
      clearTimeout(timeOut);
    };
  
    ws.on('message', function (dataStr) {
      const data = JSON.parse(dataStr);
      if (data.action === 'pushResult') {
        console.log(data);
        res[data.metric] = data.result;
        if (Object.keys(res).length === 14) {
          quit();
        }
      }
      if (data.action === 'pushValidationError') {
        quit();
      }
    });
    ws.on('error', function (error) {
      console.log(error);
      quit();
    });
  })
};