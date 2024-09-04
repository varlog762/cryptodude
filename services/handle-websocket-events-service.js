import socket from './websocket-service.js';

socket.on('open', () => {
  console.log('Connected to WebSocket');
});

socket.on('message', data => {
  const message = JSON.parse(data);

  if (message.event !== 'error' && message.data) {
    console.log(`Received data:`, message?.data.at(0));
  }
});

// eslint-disable-next-line import/prefer-default-export
export const sendToWebSocket = message => {
  socket.send(message);
};
