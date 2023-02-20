import {
  LitElement,
  html,
  css,
  ref,
  createRef,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';
import { buttonStyles } from './styles.js';
import { formatCurrency } from './utils.js';

export class ResultsModal extends LitElement {
  static styles = [
    buttonStyles,
    css`
      dialog {
        border: none;
        padding: 16px;
        background: transparent;
      }

      form {
        box-shadow: 0 2px 5px rgb(0 0 0 / 20%);
        border-radius: 8px;
        background: white;
        padding: 16px;
      }

      dialog::backdrop {
        background: rgb(0 0 0 / 30%);
      }

      table {
        --table-border: 1px solid rgb(0 0 0 / 20%);

        width: 100%;
        margin-bottom: 16px;
        border: var(--table-border);
      }

      tbody {
        border: none;
      }

      tr {
        border: none;
      }

      th {
        vertical-align: top;
        padding: 8px;
        text-align: left;
      }

      th,
      td {
        border: var(--table-border);
      }

      td {
        padding: 8px;
      }
    `,
  ];

  static properties = {
    paid: { type: Array },
    left: { type: Array },
  };

  constructor() {
    super();

    this.paid = [];
    this.left = [];

    this.modalRef = createRef();
  }

  onOpen() {
    this.modalRef.value?.showModal();
  }

  render() {
    return html`
      <dialog ${ref(this.modalRef)}>
        <form method="dialog">
          <table>
            <tbody>
              <tr>
                <th>Pagador</th>
                <th>Pago</th>
                <th>A receber</th>
              </tr>
              ${this.paid.map(
                ({ player, paid, payback }) => html`
                  <tr>
                    <td>${player.name}</td>
                    <td>${formatCurrency(paid)}</td>
                    <td>${formatCurrency(payback)}</td>
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
              ${this.left.map(
                (row) => html`
                  <tr>
                    ${row.map((td) => html`<td>${td}</td>`)}
                  </tr>
                `
              )}
            </tbody>
          </table>

          <button autofocus class="btn primary">Fechar</button>
        </form>
      </dialog>
    `;
  }
}

customElements.define('results-modal', ResultsModal);
