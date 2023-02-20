import {
  LitElement,
  html,
  css,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { inputStyles } from './styles.js';

export const PlayerEvents = {
  UPDATE: 'player:update',
};

export class UserInput extends LitElement {
  static styles = [
    inputStyles,
    css`
      .percent-container {
        margin-top: 16px;
      }

      .range-container {
        display: flex;
        width: 100%;
      }

      input[type='range'] {
        width: 100%;
        color: var(--primary-color);
      }

      output {
        margin-left: 8px;
        width: 3ch;
      }
    `,
  ];

  static properties = {
    uid: { type: String },
    name: { type: String },
    value: { type: Number },
  };

  constructor() {
    super();

    this.uid = '';
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
          @input="${this.#updatePlayer}"
      /></label>
      <label class="percent-container"
        >Porcentagem
        <div class="range-container">
          <input
            id=${this.uid}
            type="range"
            min="0"
            max="100"
            name="value"
            .value=${this.value}
            @input="${this.#updatePlayer}"
          />
          <output for=${this.uid}>${this.value}%</output>
        </div>
      </label>
    `;
  }

  #updatePlayer = (evt) => {
    this[evt.target.name] = evt.target.value;

    const event = new CustomEvent(PlayerEvents.UPDATE, {
      bubbles: true,
      composed: true,
      detail: {
        uid: this.uid,
        name: this.name,
        value: this.value,
      },
    });

    this.dispatchEvent(event);
  };
}

customElements.define('player-input', UserInput);
