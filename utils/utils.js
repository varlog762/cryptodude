export const isTickerAvailable = (tickerName, tickersCollection) => {
  return tickersCollection.some(t => {
    return t.fullName.toLowerCase().includes(tickerName.toLowerCase());
  });
};

export const stringifyCommandMessages = messageObjaect => {
  return Object.entries(messageObjaect)
    .map(item => `${item[0]} - ${item[1]}`)
    .join('\n');
};
