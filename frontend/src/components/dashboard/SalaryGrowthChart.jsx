import { useState, useMemo, useRef } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateIndonesian, formatCompactRupiah } from '../../utils/formatDate';
import './SalaryGrowthChart.css';

const SalaryGrowthChart = ({ salaries = [], loading = false, error = false }) => {
  const [activePoint, setActivePoint] = useState(null);
  const wrapperRef = useRef(null);

  // 1. Filter out future-dated records and sort chronologically
  const eligibleSalaries = useMemo(() => {
    if (!salaries || !Array.isArray(salaries)) return [];

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return salaries
      .filter((s) => s && s.effective_date && s.effective_date <= todayStr && typeof s.amount === 'number')
      .sort((a, b) => {
        const dateCmp = a.effective_date.localeCompare(b.effective_date);
        if (dateCmp !== 0) return dateCmp;
        return (a.id || 0) - (b.id || 0);
      });
  }, [salaries]);

  // 2. Chart dimensions and scale calculations
  const chartData = useMemo(() => {
    if (eligibleSalaries.length < 2) return null;

    const width = 720;
    const height = 320;
    const padding = { top: 30, right: 35, bottom: 50, left: 85 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const amounts = eligibleSalaries.map((s) => s.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);
    const amountRange = maxAmount - minAmount;

    // Buffer range on Y-axis for aesthetic padding
    const yMin = Math.max(0, amountRange === 0 ? minAmount * 0.8 : minAmount - amountRange * 0.15);
    const yMax = amountRange === 0 ? maxAmount * 1.2 : maxAmount + amountRange * 0.15;
    const effectiveYRange = yMax - yMin || 1;

    // Compute coordinate points
    const points = eligibleSalaries.map((s, idx) => {
      const x = padding.left + (idx / (eligibleSalaries.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - ((s.amount - yMin) / effectiveYRange) * innerHeight;

      let diff = null;
      let diffPercent = null;
      if (idx > 0) {
        const prevAmount = eligibleSalaries[idx - 1].amount;
        diff = s.amount - prevAmount;
        diffPercent = prevAmount > 0 ? ((diff / prevAmount) * 100).toFixed(1) : null;
      }

      return {
        ...s,
        index: idx,
        x,
        y,
        diff,
        diffPercent,
      };
    });

    // Build SVG path strings
    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const bottomY = padding.top + innerHeight;
    const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${bottomY} L ${firstPoint.x.toFixed(1)} ${bottomY} Z`;

    // Generate 5 Y-axis grid ticks
    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }).map((_, i) => {
      const value = yMin + (effectiveYRange * i) / (tickCount - 1);
      const y = padding.top + innerHeight - (i / (tickCount - 1)) * innerHeight;
      return { value, y };
    });

    return {
      width,
      height,
      padding,
      innerWidth,
      innerHeight,
      points,
      linePath,
      areaPath,
      yTicks,
      bottomY,
    };
  }, [eligibleSalaries]);

  // Loading State
  if (loading) {
    return (
      <div className="salary-chart-card">
        <div className="salary-chart-header">
          <h4 className="salary-chart-title">Pertumbuhan Gaji</h4>
          <span className="salary-chart-subtitle">Memuat data...</span>
        </div>
        <div className="chart-skeleton-bar" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="salary-chart-card">
        <div className="salary-chart-header">
          <h4 className="salary-chart-title">Pertumbuhan Gaji</h4>
        </div>
        <div className="chart-state-container">
          <div className="chart-state-icon">⚠️</div>
          <div className="chart-state-title">Gagal Memuat Data Grafik</div>
          <p className="chart-state-desc">
            Terjadi kendala saat mengambil riwayat gaji. Pastikan koneksi backend aktif dan Anda telah masuk.
          </p>
        </div>
      </div>
    );
  }

  // Empty State (No records on or before today)
  if (eligibleSalaries.length === 0) {
    return (
      <div className="salary-chart-card">
        <div className="salary-chart-header">
          <h4 className="salary-chart-title">Pertumbuhan Gaji</h4>
          <span className="salary-chart-subtitle">Riwayat Nominal Gaji</span>
        </div>
        <div className="chart-state-container">
          <div className="chart-state-icon">📈</div>
          <div className="chart-state-title">Belum Ada Riwayat Gaji Berlaku</div>
          <p className="chart-state-desc">
            Riwayat gaji yang efektif pada atau sebelum hari ini belum tercatat. Data gaji bertanggal masa depan tidak ditampilkan dalam tren historis.
          </p>
        </div>
      </div>
    );
  }

  // Single-Point State (Only 1 eligible record)
  if (eligibleSalaries.length === 1) {
    const single = eligibleSalaries[0];
    return (
      <div className="salary-chart-card">
        <div className="salary-chart-header">
          <h4 className="salary-chart-title">Pertumbuhan Gaji</h4>
          <span className="salary-chart-subtitle">Riwayat Nominal Gaji</span>
        </div>
        <div className="chart-state-container">
          <div className="chart-single-point-card">
            <div className="chart-single-point-label">Gaji Awal Terdaftar</div>
            <div className="chart-single-point-val">{formatCurrency(single.amount)}</div>
            <div className="chart-single-point-date">
              Berlaku sejak: <strong>{formatDateIndonesian(single.effective_date)}</strong>
              {single.notes ? ` • ${single.notes}` : ''}
            </div>
          </div>
          <p className="chart-state-desc">
            Baru terdapat 1 riwayat gaji berlaku. Grafik garis perkembangan gaji akan aktif secara otomatis setelah Anda menambahkan data perubahan gaji berikutnya.
          </p>
        </div>
      </div>
    );
  }

  // Multi-point Normal Line Chart State
  return (
    <div className="salary-chart-card">
      <div className="salary-chart-header">
        <div>
          <h4 className="salary-chart-title">Grafik Pertumbuhan Gaji</h4>
          <p className="salary-chart-subtitle">
            Tren nominal gaji historis berdasarkan tanggal efektif ({eligibleSalaries.length} perubahan tercatat)
          </p>
        </div>
      </div>

      <div className="salary-chart-wrapper" ref={wrapperRef}>
        <svg
          viewBox={`0 0 ${chartData.width} ${chartData.height}`}
          className="salary-chart-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Grafik garis pertumbuhan gaji dari waktu ke waktu"
        >
          <defs>
            <linearGradient id="salaryGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {chartData.yTicks.map((tick, i) => (
            <g key={`y-tick-${i}`}>
              <line
                x1={chartData.padding.left}
                y1={tick.y}
                x2={chartData.width - chartData.padding.right}
                y2={tick.y}
                className="chart-grid-line"
              />
              <text
                x={chartData.padding.left - 12}
                y={tick.y + 4}
                textAnchor="end"
                className="chart-axis-label"
              >
                {formatCompactRupiah(tick.value)}
              </text>
            </g>
          ))}

          {/* X Axis Baseline */}
          <line
            x1={chartData.padding.left}
            y1={chartData.bottomY}
            x2={chartData.width - chartData.padding.right}
            y2={chartData.bottomY}
            className="chart-axis-line"
          />

          {/* Area Fill Under the Line */}
          <path d={chartData.areaPath} className="chart-area-path" />

          {/* Main Trend Line */}
          <path d={chartData.linePath} className="chart-line-path" />

          {/* Active Hover Guide Line */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={chartData.padding.top}
              x2={activePoint.x}
              y2={chartData.bottomY}
              className="chart-guide-line"
            />
          )}

          {/* Interactive Data Points and X-axis Labels */}
          {chartData.points.map((pt) => {
            const isActive = activePoint && activePoint.id === pt.id;
            return (
              <g
                key={`point-${pt.id}-${pt.index}`}
                className={`chart-point-group ${isActive ? 'active' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`Gaji ${formatCurrency(pt.amount)} per ${formatDateIndonesian(pt.effective_date)}`}
                onMouseEnter={() => setActivePoint(pt)}
                onFocus={() => setActivePoint(pt)}
                onMouseLeave={() => setActivePoint(null)}
                onBlur={() => setActivePoint(null)}
              >
                {/* Data point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6.5 : 4.5}
                  className="chart-point-circle"
                />

                {/* X-axis Date label */}
                <text
                  x={pt.x}
                  y={chartData.bottomY + 22}
                  textAnchor="middle"
                  className="chart-axis-label-x"
                >
                  {formatDateIndonesian(pt.effective_date)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Interactive Tooltip Box */}
        {activePoint && (
          <div
            className="chart-tooltip-box"
            style={{
              left: `${(activePoint.x / chartData.width) * 100}%`,
              top: `${(activePoint.y / chartData.height) * 100}%`,
            }}
          >
            <div className="chart-tooltip-date">{formatDateIndonesian(activePoint.effective_date)}</div>
            <div className="chart-tooltip-amount">{formatCurrency(activePoint.amount)}</div>
            {activePoint.diff !== null && (
              <div
                className={`chart-tooltip-diff ${
                  activePoint.diff > 0 ? 'increase' : activePoint.diff < 0 ? 'decrease' : 'neutral'
                }`}
              >
                {activePoint.diff > 0
                  ? `▲ +${formatCurrency(activePoint.diff)} (+${activePoint.diffPercent}%)`
                  : activePoint.diff < 0
                  ? `▼ -${formatCurrency(Math.abs(activePoint.diff))} (${activePoint.diffPercent}%)`
                  : 'Tetap (0%)'}
              </div>
            )}
            {activePoint.index === 0 && (
              <div className="chart-tooltip-diff neutral">Gaji Pertama</div>
            )}
            {activePoint.notes && (
              <div className="chart-tooltip-notes">“{activePoint.notes}”</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryGrowthChart;
