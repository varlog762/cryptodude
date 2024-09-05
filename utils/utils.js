export const isTickerAvailable = (tickerName, tickersCollection) =>
  tickersCollection.some(t =>
    t.fullName.toLowerCase().includes(tickerName.toLowerCase())
  );

export const stringifyCommandMessages = messageObject =>
  Object.entries(messageObject)
    .map(item => `${item[0]} - ${item[1]}`)
    .join('\n');

export const createMessageForWebSocket = (tickerName, command) =>
  JSON.stringify({
    op: command,
    args: [
      {
        channel: 'tickers',
        instId: `${tickerName}-USDT`,
      },
    ],
  });
