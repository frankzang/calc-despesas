import {
  LitElement,
  html,
  css,
  repeat,
  createRef,
  ref,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

import { PlayerEvents } from './player-input.js';
import { ExpenseEvents, ExpenseStatus } from './player-expense.js';
import { formatCurrency, clamp } from './utils.js';
import { buildUser, buildExpense } from './data.js';
import { buttonStyles } from './styles.js';

// Components
import './results-modal.js';

const DatabaseKeys = {
  PLAYERS: 'players',
  EXPENSES: 'expenses',
};

export class App extends LitElement {
  static styles = [
    buttonStyles,
    css`
      * {
        box-sizing: border-box;
      }

      main {
        padding-bottom: 70px;
        postion: relative;
      }

      section {
        width: 100%;
        padding: 16px;
        margin-bottom: 16px;
      }

      .players {
        display: flex;
        gap: 16px;
        width: 100%;
      }

      .expenses {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
        box-sizing: border-box;
      }

      .create-expense-btn {
        margin-bottom: 32px;
      }

      footer {
        position: fixed;
        bottom: 0px;
        width: 100%;
        padding: 8px;
        background-color: white;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }

      .loading {
        padding: 16px;
      }
    `,
  ];

  static properties = {
    players: { type: Array, state: true },
    expenses: { type: Array, state: true },
    isLoadingData: { type: Boolean, state: true },
  };

  constructor() {
    super();

    this.isLoadingData = true;

    this.players = [
      buildUser({ name: 'pagador 1', value: 50 }),
      buildUser({ name: 'pagador 2', value: 50 }),
    ];

    this.expenses = [];

    this.resultsModalRef = createRef();

    this.#getData();
    this.#initEventListners();
  }

  #getData = async () => {
    const [players, expenses] = await Promise.allSettled([
      get(DatabaseKeys.PLAYERS),
      get(DatabaseKeys.EXPENSES),
    ]);

    if (players.value) this.players = players.value;
    if (expenses.value) this.expenses = expenses.value;

    this.isLoadingData = false;
  };

  #initEventListners = () => {
    this.addEventListener(PlayerEvents.UPDATE, this.#onUpdatePlayer);

    this.addEventListener(ExpenseEvents.UPDATE, this.#onUpdateExpense);

    this.addEventListener(ExpenseEvents.REMOVE, this.#onRemoveExpense);
  };

  #savePlayers = () => set(DatabaseKeys.PLAYERS, this.players);

  #saveExpenses = () => set(DatabaseKeys.EXPENSES, this.expenses);

  #onUpdatePlayer = (evt) => {
    const { uid, ...rest } = evt.detail;

    const currentPlayer = this.players.find((p) => p.uid === uid);
    const updatedPlayer = {
      ...currentPlayer,
      ...rest,
    };

    this.players.splice(
      this.players.findIndex((expense) => expense.uid === uid),
      1,
      updatedPlayer
    );

    this.players.forEach((player) => {
      if (player.uid !== currentPlayer.uid) {
        player.value = 100 - rest.value;
      }
    });

    this.players = [...this.players];

    this.#savePlayers();
  };

  #onUpdateExpense = (evt) => {
    const { uid, ...rest } = evt.detail;

    const currentExpense = this.expenses.find((expense) => expense.uid === uid);
    const updatedExpense = {
      ...currentExpense,
      ...rest,
    };

    this.expenses.splice(
      this.expenses.findIndex((expense) => expense.uid === uid),
      1,
      updatedExpense
    );

    this.expenses = [...this.expenses];

    this.#saveExpenses();
  };

  #onRemoveExpense = (evt) => {
    const { uid } = evt.detail;

    this.expenses = this.expenses.filter((expense) => expense.uid !== uid);

    // this.#saveExpenses();
  };

  render() {
    if (this.isLoadingData) return html`<p class="loading">Carregando...</p>`;

    return html`
      <main>
        <section aria-labeledby="players-title">
          <h1 id="players-title" class="section-title">Pagadores</h1>
          <div class="players">
            ${this.players.map(
              (player) =>
                html`
                  <player-input
                    uid="${player.uid}"
                    name="${player.name}"
                    value="${player.value}"
                  ></player-input>
                `
            )}
          </div>
        </section>
        <section aria-labeledby="expenses-title">
          <h2 id="expenses-title" class="section-title">Despesas</h2>
          <button
            type="button"
            @click="${this.#addExpense}"
            class="btn primary create-expense-btn"
          >
            Nova despesa
          </button>
          <div class="expenses">
            ${repeat(
              this.expenses,
              (expense) => expense.uid,
              (expense) => html`<user-expense
                .uid=${expense.uid}
                .name=${expense.name}
                .amount=${expense.amount}
                .paidBy=${expense.paidBy}
                .players=${this.players}
              >
              </user-expense>`
            )}
          </div>
        </section>
        ${html`
          <footer>
            <button
              ?disabled=${this.expenses.length === 0}
              @click=${this.#openResultsModal}
              class="btn primary"
            >
              mostrar resultados
            </button>
          </footer>
        `}
        <results-modal
          ${ref(this.resultsModalRef)}
          .paid=${this.#totalAlreadyPaid}
          .left=${this.#totalLeftToPay}
        ></results-modal>
      </main>
    `;
  }

  #addExpense = () => {
    this.expenses = [buildExpense(), ...this.expenses];
  };

  get #totalAlreadyPaid() {
    return this.players.map((player) => {
      const paid = this.expenses
        .filter((expense) => expense.paidBy === player.uid)
        .reduce((acc, next) => acc + next.amount, 0);

      const payback = paid - paid * (player.value / 100);

      return {
        player,
        paid,
        payback,
      };
    });
  }

  get #totalLeftToPay() {
    return this.players.map((player) => {
      const totalAlreadyPaidByThisPlayer = this.#totalAlreadyPaid.find(
        (data) => data.player.uid === player.uid
      );

      const totalToBePaid = this.expenses
        .filter((expense) => expense.paidBy === ExpenseStatus.ToBePaid)
        .reduce((acc, next) => acc + next.amount, 0);

      const percentToPay = totalToBePaid * (player.value / 100);

      const minusPaid = percentToPay - totalAlreadyPaidByThisPlayer.payback;

      return [
        player.name,
        formatCurrency(percentToPay),
        formatCurrency(clamp(0, Infinity, minusPaid)),
      ];
    });
  }

  #openResultsModal = () => {
    this.resultsModalRef.value.onOpen();
  };
}

customElements.define('app-container', App);
