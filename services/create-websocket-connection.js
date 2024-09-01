import WebSocket from 'ws';

import C from '../constants/constants.js';

const socket = new WebSocket(C.BINANCE_WS_URL);

socket.on('open', () => {
  console.log('Connected to Binance WebSocket');
});

socket.on('message', data => {
  const message = JSON.parse(data);
  console.log(message);
});

const createMessageForWebSocket = ticker => {
  return JSON.stringify({
    method: 'SUBSCRIBE',
    params: [
      `${ticker.toLowerCase()}usdt@aggTrade`,
      `${ticker.toLowerCase()}usdt@depth`,
    ],
    id: Date.now(),
  });
};

export const subscribeToTickerUpdates = ticker => {
  try {
    const message = createMessageForWebSocket(ticker);
    console.log(message);
    socket.send(message);
  } catch (error) {
    console.log(error);
  }
};
