// Utility functions for testing copy/cut/paste
export function calculateSum(a, b) {
  return a + b;
}

export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export const constants = {
  MAX_RETRY: 3,
  TIMEOUT: 5000,
  API_VERSION: 'v1'
};