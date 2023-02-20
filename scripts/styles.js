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
`;

export const buttonStyles = css`
  .btn {
    width: 100%;
    background: transparent;
    padding: 16px;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: bold;
    border: 1px solid var(--secondary-color);
    border-radius: 8px;
    cursor: pointer;
  }

  .primary {
    color: white;
    background-color: var(--primary-color);
  }

  .btn:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(0, 0, 0, 0.7);
  }
`;
