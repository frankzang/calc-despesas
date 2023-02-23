import { uniqueId } from './utils.js';
import { ExpenseStatus } from './player-expense.js';

export const buildUser = ({ name = '', value = 0 } = {}) => ({
  uid: uniqueId(),
  name,
  value,
});

export const buildExpense = ({ name = '', amount = 0 } = {}) => ({
  uid: uniqueId(),
  name,
  amount,
  paidBy: ExpenseStatus.ToBePaid,
});
