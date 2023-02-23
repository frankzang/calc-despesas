import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { buttonStyles, inputStyles } from './styles.js';

export const ExpenseStatus = {
  ToBePaid: 'ToBePaid',
};

export const ExpenseEvents = {
  REMOVE: 'expense:remove',
  UPDATE: 'expense:update',
};

export class UserExpense extends LitElement {
  static styles = [
    inputStyles,
    buttonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .inputs-row {
        display: flex;
        gap: 16px;
        width: 100%;
      }

      .payers-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
      }

      .remove-expense {
        margin-left: auto;
      }
    `,
  ];

  static properties = {
    uid: { type: String },
    name: { type: String },
    amount: { type: Number },
    paidBy: { type: String },
    players: { type: Array },
  };

  constructor() {
    super();

    this.uid = '';
    this.name = '';
    this.amount = 0;
    this.paidBy = '';
  }

  render() {
    return html`
      <div class="inputs-row">
        <label
          >Nome
          <input
            type="text"
            name="name"
            .value=${this.name}
            @input="${this.#updateExpense}"
          />
        </label>

        <label
          >Valor
          <input
            type="text"
            name="amount"
            .value=${this.amount}
            @input="${this.#updateExpense}"
            inputmode="decimal"
          />
        </label>
      </div>

      <fieldset class="payers-row">
        <legend>Já pago por</legend>
        ${this.players.map(
          (player) => html`<label>
            <input
              type="radio"
              name="paidBy"
              value="${player.uid}"
              @input="${this.#updateExpense}"
            />
            ${player.name}
          </label>`
        )}

        <label>
          A pagar
          <input
            type="radio"
            name="paidBy"
            checked="${this.paidBy === ExpenseStatus.ToBePaid}"
            value=${ExpenseStatus.ToBePaid}
            @input="${this.#updateExpense}"
          />
        </label>
      </fieldset>

      <button @click="${this.#removeExpense}" class="btn link remove-expense">
        Remover despesa
      </button>
    `;
  }

  #updateExpense = (evt) => {
    const { name, value } = evt.target;

    if (name === 'amount') {
      const cleanValue = Number(
        value.replace(/[^0-9.,]/g, '').replace(/,/g, '.')
      );

      this.value = Number(cleanValue);
    } else {
      this[evt.target.name] = evt.target.value;
    }

    const event = new CustomEvent(ExpenseEvents.UPDATE, {
      bubbles: true,
      composed: true,
      detail: {
        uid: this.uid,
        name: this.name,
        amount: this.value,
        paidBy: this.paidBy,
      },
    });
    this.dispatchEvent(event);
  };

  #removeExpense = () => {
    const event = new CustomEvent(ExpenseEvents.REMOVE, {
      bubbles: true,
      composed: true,
      detail: {
        uid: this.uid,
      },
    });

    this.dispatchEvent(event);
  };
}

customElements.define('user-expense', UserExpense);
