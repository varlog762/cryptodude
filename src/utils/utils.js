export const isTickerAvailable = (tickerName, tickersCollection) =>
  tickersCollection.some(t =>
    t.fullName.toLowerCase().includes(tickerName.toLowerCase())
  );

export const stringifyCommandMessages = messageObject =>
  Object.entries(messageObject)
    .map(item => `${item[0]} - ${item[1]}`)
    .join('\n');

export const createMessageForWebSocket = (tickerName, command) => ({
  op: command,
  args: [
    {
      channel: 'tickers',
      instId: `${tickerName}-USDT`,
    },
  ],
});

export const createTickerWatchEntry = (chatId, tickerName, originalPrice) => ({
  tickerName,
  currencyPair: `${tickerName}-USDT`,
  originalPrice,
  lastPrice: 0,
  priceIncreasePercent: 5,
  priceDecreasePercent: 5,
  chatId,
});

export const createEmitPayload = (chatId, tickerName, originalPrice) => ({
  chatId,
  tickerName,
  originalPrice,
});
