import C from './constants.js';

export default {
  [C.LIST]: 'Show all watched coins',
  [C.HELP]: 'Show avilable commands',
  [C.ADD]:
    'Add new coin subscription ("/add FIRST_CURRENCY-SECOND_CURRENCY START_PRICE-END_PRICE")',
  [C.REMOVE]:
    'Remove coin subscription ("/remove FIRST_CURRENCY-SECOND_CURRENCY")',
};
