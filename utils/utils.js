export const isTickerAvailable = (tickerName, tickersCollection) =>
  tickersCollection.some(t =>
    t.fullName.toLowerCase().includes(tickerName.toLowerCase())
  );

export const stringifyCommandMessages = messageObjaect =>
  Object.entries(messageObjaect)
    .map(item => `${item[0]} - ${item[1]}`)
    .join('\n');
