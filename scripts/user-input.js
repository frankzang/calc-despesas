import {
  LitElement,
  html,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

const randomId = () => String(Math.random() * 1000);

export class UserInput extends LitElement {
  static properties = {
    id: { type: String },
    name: { type: String },
    value: { type: Number },
  };

  constructor() {
    super();

    this.id = randomId();
    this.name = '';
    this.value = 0;
  }

  render() {
    return html`
      <label
        >Nome
        <input
          type="text"
          name="name"
          .value=${this.name}
          @input="${this._updatePlayer}"
      /></label>
      <label
        >Porcentagem
        <input
          type="range"
          min="0"
          max="100"
          name="value"
          .value=${this.value}
          data-player-id="${this.id}"
          @input="${this._updatePlayer}"
        />
        <span>${this.value}%</span>
      </label>
    `;
  }

  _updatePlayer = (evt) => {
    if (isNaN(evt.target.valueAsNumber)) {
      this[evt.target.name] = evt.target.value;
    } else {
      const ranged = Math.min(Math.max(0, evt.target.valueAsNumber), 100);

      this[evt.target.name] = ranged;
    }

    const event = new CustomEvent('user:update', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.id,
        name: this.name,
        value: this.value,
      },
    });

    this.dispatchEvent(event);
  };
}

customElements.define('user-input', UserInput);
