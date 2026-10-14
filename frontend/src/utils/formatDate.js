/**
 * Formats an ISO date string (YYYY-MM-DD) into Indonesian locale date string (e.g., '1 Jan 2024').
 */
export const formatDateIndonesian = (dateStr) => {
  if (!dateStr) return '-';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

/**
 * Formats large Rupiah numbers concisely for chart axis labels (e.g., 'Rp 5 jt', 'Rp 10 jt').
 */
export const formatCompactRupiah = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'Rp 0';
  if (value >= 1_000_000_000) {
    const num = (value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 });
    return `Rp ${num} M`;
  }
  if (value >= 1_000_000) {
    const num = (value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 });
    return `Rp ${num} jt`;
  }
  if (value >= 1_000) {
    const num = (value / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 });
    return `Rp ${num} rb`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
};
