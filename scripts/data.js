import { uniqueId } from './utils.js';
import { ExpenseStatus } from './player-expense.js';

export const buildUser = ({ name = '', value = 0 } = {}) => ({
  uid: uniqueId(),
  name,
  value,
});

export const buildExpense = ({ name = '', value = 0 } = {}) => ({
  uid: uniqueId(),
  name,
  value,
  paidBy: ExpenseStatus.ToBePaid,
});
