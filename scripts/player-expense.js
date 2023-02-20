import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { inputStyles } from './styles.js';

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
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
      }

      .players {
        display: flex;
        grid-column: 1 / span 2;
      }

      .player {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
      }

      .player input {
        padding: 0px;
        width: auto;
      }

      .inputs {
        display: flex;
        gap: inherit;
      }

      button {
        margin-left: auto;
        background: transparent;
        border: none;
        color: var(--tertiary-color);
        font-size: 1rem;
      }
    `,
  ];

  static properties = {
    uid: { type: String },
    name: { type: String },
    value: { type: Number },
    paidBy: { type: String },
    players: { type: Array },
  };

  constructor() {
    super();

    this.uid = '';
    this.name = '';
    this.value = 0;
    this.paidBy = '';
  }

  render() {
    return html`
      <div class="inputs">
        <label class="name"
          >Nome
          <input
            type="text"
            name="name"
            .value=${this.name}
            @input="${this.#updateExpense}"
          />
        </label>
        <label class="value"
          >Valor
          <input
            type="text"
            name="value"
            .value=${this.value}
            @input="${this.#updateExpense}"
            inputmode="decimal"
          />
        </label>
      </div>
      <fieldset class="players">
        <legend>Já pago por</legend>
        ${this.players.map(
          (player) => html`<label class="player">
            <input
              type="radio"
              name="paidBy"
              value="${player.uid}"
              @input="${this.#updateExpense}"
            />
            ${player.name}
          </label>`
        )}
        <label class="player">
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

      <button @click="${this.#removeExpense}" class="action">
        Remover despesa
      </button>
      <br />
    `;
  }

  #updateExpense = (evt) => {
    if (evt.target.name === 'value') {
      const value = evt.target.value;

      const cleanValue = value
        .replace(/[^0-9.,]/g, '')
        .replace(/,/g, '.')
        .replace(/^0+/, '');
      if (cleanValue !== value) {
        evt.target.value = cleanValue;
      }
    }

    this[evt.target.name] = evt.target.value;

    const event = new CustomEvent(ExpenseEvents.UPDATE, {
      bubbles: true,
      composed: true,
      detail: {
        uid: this.uid,
        name: this.name,
        value: this.value,
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
