export const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  const formatted = new Intl.NumberFormat('id-ID').format(value);
  return `Rp ${formatted}`;
};

export const formatNumberOrNA = (value) => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return String(value);
};
