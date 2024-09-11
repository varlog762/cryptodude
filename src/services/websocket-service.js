import WebSocket from 'ws';

import c from '../constants/constants.js';
import events from '../constants/events.js';

class WebSocketService {
  reconnectInterval = 1000;

  maxReconnectInterval = 30000;

  PING_INTERVAL = 15000;

  socket = null;

  pingIntervalFn = null;

  constructor(url, eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.url = url;
  }

  connect() {
    this.socket = new WebSocket(this.url);
  }

  startListeners() {
    this.startListenOpen();
    this.startListenMessage();
    this.startListenClose();
    this.startListenError();
  }

  startListenOpen() {
    this.socket.on('open', () => {
      console.log(c.WEBSOCKET_OPENED_INFO);
      this.startPing();
      this.reconnectInterval = 1000;
      this.eventEmitter.emit(events.WEBSOCKET_OPENED);
    });
  }

  startListenMessage() {
    this.socket.on('message', data => {
      const message = JSON.parse(data);

      if (message.event === 'subscribe' && message.connId) {
        const tickerName = message.arg.instId.split('-').at(0);
        this.eventEmitter.emit(events.SUBSCRIPTION_SUCCESS, tickerName);
      }

      if (message.event !== 'error' && message.data) {
        const { instId: currencyPair, last: lastPrice } = message.data.at(0);

        const updatedPrice = {
          currencyPair,
          lastPrice,
        };

        // console.log(currencyPair, lastPrice);

        this.eventEmitter.emit(events.PRICE_UPDATED, updatedPrice);
      }
    });
  }

  startListenClose() {
    this.socket.on('close', () => {
      console.log(c.WEBSOCKET_CLOSED_INFO);
      this.eventEmitter.emit(events.WEBSOCKET_CLOSED);
      this.stopPing();
      this.attemptReconnect();
    });
  }

  startListenError() {
    this.socket.on('error', error => {
      console.log(c.WEBSOCKET_ERROR, error.message);
      this.socket.close();
    });
  }

  attemptReconnect() {
    if (this.reconnectInterval < this.maxReconnectInterval) {
      this.reconnectInterval *= 2;
    }

    setTimeout(() => {
      console.log(c.WEBSOCKET_RECONNECT_INFO);
      this.eventEmitter.emit('websocket-reconnect');
      this.connect();
    }, this.reconnectInterval);
  }

  startPing() {
    this.pingIntervalFn = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        console.log(c.SENDING_PING_INFO);
        this.socket.ping();
      }
    }, this.PING_INTERVAL);
  }

  stopPing() {
    clearInterval(this.pingIntervalFn);
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      console.log('Message sent to WebSocket:', message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }
}

export default WebSocketService;
