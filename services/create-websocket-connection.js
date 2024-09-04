import WebSocket from 'ws';

import C from '../constants/constants.js';

const socket = new WebSocket(C.OKX_WS_URL);

socket.on('open', () => {
  console.log('Connected to WebSocket');
});

socket.on('message', data => {
  const message = JSON.parse(data);
  let count = [];

  if (message.event !== 'error' && message.data) {
    console.log(`Received data:`, message?.data.at(0));
  }
  console.log(count.length);
});

const createMessageForWebSocket = ticker => {
  return JSON.stringify({
    op: 'subscribe',
    args: [
      {
        channel: 'tickers',
        instId: `${ticker}-USDT`,
      },
    ],
  });
};

export const subscribeToTickerUpdates = ticker => {
  try {
    const message = createMessageForWebSocket(ticker);
    socket.send(message);
  } catch (error) {
    console.log(error);
  }
};
