import {
  LitElement,
  html,
  repeat,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { ExpenseStatus } from './user-expense.js';
import { clamp } from './utils.js';

const randomId = () => String(Math.random() * 1000);

const buildUser = ({ name = '', value = 0 } = {}) => ({
  id: randomId(),
  name,
  value,
});

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'BRL',
});

const buildExpense = ({ name = '', value = 0 } = {}) => ({
  id: randomId(),
  name,
  value,
  paidBy: ExpenseStatus.ToBePaid,
});

export class MyElement extends LitElement {
  static properties = {
    players: { type: Array, state: true },
    expenses: { type: Array, state: true },
  };

  constructor() {
    super();

    this.players = [
      buildUser({ name: 'Luigi', value: 85 }),
      buildUser({
        name: 'Mario',
        value: 15,
      }),
    ];

    this.expenses = [
      buildExpense({ name: 'dep 1', value: 450 }),
      buildExpense({ name: 'dep 2', value: 790 }),
      buildExpense({ name: 'dep 3', value: 854 }),
    ];

    this.addEventListener('user:update', (evt) => {
      const { id, name, value } = evt.detail;

      const currntPlayer = this.players.find((p) => p.id === id);

      currntPlayer.value = value;
      currntPlayer.name = name;

      this.players.forEach((player) => {
        if (player !== currntPlayer) {
          player.value = 100 - value;
        }
      });

      this.players = [...this.players];
    });

    this.addEventListener('expense:update', (evt) => {
      const { id, name, value, paidBy } = evt.detail;

      const currentExpense = this.expenses.find((expense) => expense.id === id);

      currentExpense.name = name;
      currentExpense.value = value;
      currentExpense.paidBy = paidBy;

      this.expenses = [...this.expenses];
    });

    this.addEventListener('expense:remove', (evt) => {
      const { id } = evt.detail;
      this.expenses = this.expenses.filter((expense) => expense.id !== id);
    });
  }

  render() {
    return html`
      ${this.players.map(
        (player) =>
          html`
            <user-input
              id="${player.id}"
              name="${player.name}"
              value="${player.value}"
            ></user-input>
            <br />
          `
      )}
      <h2>Despesas</h2>
      <button type="button" @click="${this._addExpense}">Nova despesa</button>
      <br />
      <br />

      ${repeat(
        this.expenses,
        (expense) => expense.id,
        (expense) => html`<user-expense
          .id=${expense.id}
          .name=${expense.name}
          .value=${expense.value}
          .paidBy=${expense.paidBy}
          .players=${this.players}
        ></user-expense>`
      )}

      <table>
        <tbody>
          <tr>
            <th>Pagador</th>
            <th>Pago</th>
            <th>A receber</th>
          </tr>
          ${this._getTotalPayedByPlayerList().map(
            (row) => html`
              <tr>
                ${row.map((td) => html`<td>${td}</td>`)}
              </tr>
            `
          )}
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>Pagador</th>
            <th>Total a pagar</th>
            <th>Total a pagar menos valor pago</th>
          </tr>
          ${this._getTotalToPay().map(
            (row) => html`
              <tr>
                ${row.map((td) => html`<td>${td}</td>`)}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  _addExpense = () => {
    this.expenses = [buildExpense(), ...this.expenses];
  };

  _getTotalPayedByPlayer = () => {
    const pps = this.players.map((player) => {
      const paid = this.expenses
        .filter((expense) => expense.paidBy === player.id)
        .reduce((acc, next) => acc + next.value, 0);

      const payback = paid - paid * (player.value / 100);

      return {
        player,
        paid,
        payback,
      };
    });

    return pps;
  };

  _getTotalPayedByPlayerList = () => {
    return this._getTotalPayedByPlayer().map((data) => [
      data.player.name,
      data.paid,
      data.payback,
    ]);
  };

  _getTotalToPay = () => {
    const totalToPayByUser = this.players.map((player) => {
      const totalPaidByUser = this._getTotalPayedByPlayer();
      const totalPaiedByThisUser = totalPaidByUser.find(
        (data) => data.player.id === player.id
      );
      const exp = this.expenses;

      console.log(this.expenses[0]);

      const toPay = this.expenses
        .filter((expense) => expense.paidBy === ExpenseStatus.ToBePaid)
        .reduce((acc, next) => acc + next.value, 0);

      const percentToPay = toPay * (player.value / 100);

      const minusPaid = percentToPay - totalPaiedByThisUser.payback;

      const res = [
        player.name,
        currencyFormatter.format(percentToPay),
        currencyFormatter.format(clamp(0, Infinity, minusPaid)),
      ];

      return res;
    });

    return totalToPayByUser;
  };
}

customElements.define('my-element', MyElement);
