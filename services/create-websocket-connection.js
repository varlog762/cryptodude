import { EventEmitter } from 'node:events';
import WebSocket from 'ws';

import C from '../constants/constants.js';

const emitter = new EventEmitter();
const socket = new WebSocket(C.OKX_WS_URL);

socket.on('open', () => {
  console.log('Connected to WebSocket');
});

socket.on('message', data => {
  const message = JSON.parse(data);

  if (message.event !== 'error' && message.data) {
    console.log(`Received data:`, message?.data.at(0));
    emitter.emit('hello');
  }
});

const createMessageForWebSocket = ticker =>
  JSON.stringify({
    op: 'subscribe',
    args: [
      {
        channel: 'tickers',
        instId: `${ticker}-USDT`,
      },
    ],
  });

// eslint-disable-next-line import/prefer-default-export
export const subscribeToTickerUpdates = ticker => {
  try {
    const message = createMessageForWebSocket(ticker);
    socket.send(message);
  } catch (error) {
    console.log(error);
  }
};
