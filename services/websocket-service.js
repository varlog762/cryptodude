import WebSocket from 'ws';

import c from '../constants/constants.js';

export default new WebSocket(c.OKX_WS_URL);
