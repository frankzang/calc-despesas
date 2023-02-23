import { css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

export const inputStyles = css`
  * {
    box-sizing: border-box;
  }

  :host {
    width: 100%;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    font-size: 1rem;
  }

  input[type='text'] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid rgba(0, 0, 0, 0.8);
    border-radius: 8px;
  }

  label:has(input[type='radio']) {
    flex-direction: row;
    align-items: center;
  }
`;

export const buttonStyles = css`
  .btn {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .btn:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(0, 0, 0, 0.7);
  }

  .primary {
    color: white;
    background-color: var(--primary-color);
    border-radius: 8px;
    padding: 16px;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: bold;
    width: 100%;
  }

  .link {
    width: max-content;
    padding: 0;
  }

  .link:hover,
  .link:focus {
    text-decoration: underline;
  }
`;
