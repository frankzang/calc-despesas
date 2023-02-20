import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

const randomId = () => String(Math.random() * 1000);

export const ExpenseStatus = {
  ToBePaid: 'ToBePaid',
};

export class UserExpense extends LitElement {
  static properties = {
    id: { type: String },
    name: { type: String },
    value: { type: Number },
    paidBy: { type: String },
    players: { type: Array },
  };

  constructor() {
    super();

    this.id = randomId();
    this.name = '';
    this.value = 0;
    this.paidBy = '';
  }

  render() {
    console.log(this.paidBy);
    return html`
      <label
        >Nome
        <input
          type="text"
          name="name"
          .value=${this.name}
          @input="${this._updatePlayer}"
        />
      </label>
      <label
        >Valor
        <input
          type="number"
          name="value"
          .value=${this.value}
          @input="${this._updatePlayer}"
        />
        <br />
        <div>
          Já pago por
          ${this.players.map(
            (player) => html`<label>
              ${player.name}
              <input
                type="radio"
                name="paidBy"
                value="${player.id}"
                @input="${this._updatePlayer}"
              />
            </label>`
          )}
          <label>
            A pagar
            <input
              type="radio"
              name="paidBy"
              checked="${this.paidBy === ExpenseStatus.ToBePaid}"
              value=${ExpenseStatus.ToBePaid}
              @input="${this._updatePlayer}"
            />
          </label>
        </div>
      </label>
      <button @click="${this._removeExpense}">x</button>
      <br />
    `;
  }

  _updatePlayer = (evt) => {
    if (isNaN(evt.target.valueAsNumber)) {
      this[evt.target.name] = evt.target.value;
    } else {
      this[evt.target.name] = evt.target.valueAsNumber;
    }

    const event = new CustomEvent('expense:update', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.id,
        name: this.name,
        value: this.value,
        paidBy: this.paidBy,
      },
    });

    this.dispatchEvent(event);
  };

  _removeExpense = (evt) => {
    const event = new CustomEvent('expense:remove', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.id,
      },
    });

    this.dispatchEvent(event);
  };
}

customElements.define('user-expense', UserExpense);
