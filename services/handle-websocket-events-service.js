import socket from './websocket-service.js';
import { getWatchList } from './handle-subscribe-to-price-updates-service.js';

socket.on('open', () => {
  console.log('Connected to WebSocket');
});

socket.on('message', data => {
  const message = JSON.parse(data);
  if (message.event !== 'error' && message.data) {
    const watchedTickers = getWatchList();

    const filteredData = message.data.map(t =>
      watchedTickers.filter(ticker => ticker.currencyPair === t.instId)
    );

    // console.log(watchedTickers, message.data);
    console.log(filteredData, message.data[0]);
  }
});

// eslint-disable-next-line import/prefer-default-export
export const sendToWebSocket = message => {
  socket.send(message);
};

// {
//   instType: 'SPOT',
//   instId: 'BTC-USDT',
//   last: '56808.1',
//   lastSz: '0.00001759',
//   askPx: '56808.1',
//   askSz: '0.63191674',
//   bidPx: '56808',
//   bidSz: '0.09849608',
//   open24h: '56708.5',
//   high24h: '58522.1',
//   low24h: '56179.6',
//   sodUtc0: '57970',
//   sodUtc8: '58128.2',
//   volCcy24h: '483891391.238049644',
//   vol24h: '8430.06085704',
//   ts: '1725528824560'
// }

// {
//   tickerName: 'BTC',
//   currencyPair: 'BTC/USDT',
//   startPrice: 1,
//   endPrice: 2,
//   chatId: 340457599
// }
