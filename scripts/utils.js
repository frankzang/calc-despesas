import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const uniqueId = () => uuidv4();

export const clamp = (min, max, value) => Math.min(Math.max(min, value), max);

export const formatCurrency = (value = '') =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
