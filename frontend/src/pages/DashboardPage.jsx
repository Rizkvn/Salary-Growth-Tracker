import { useEffect, useState } from 'react';
import { getDashboard, getForecast } from '../services/dashboardService';
import { getSalaries } from '../services/salaryService';
import StatCard from '../components/dashboard/StatCard';
import SalaryGrowthChart from '../components/dashboard/SalaryGrowthChart';
import { formatCurrency, formatNumberOrNA } from '../utils/formatCurrency';
import './DashboardPage.css';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardData, forecastData, salaryData] = await Promise.all([
          getDashboard(),
          getForecast(),
          getSalaries(),
        ]);
        if (isMounted) {
          setMetrics(dashboardData);
          setForecast(forecastData);
          setSalaries(salaryData || []);
        }
      } catch {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="loading-text">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-text">Failed to load dashboard data.</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      
      <div className="dashboard-section">
        <h3 className="section-title">Dashboard Metrics</h3>
        <div className="metrics-grid">
          <StatCard 
            label="Current Salary" 
            value={formatCurrency(metrics?.current_salary)} 
            data-testid="stat-current-salary"
          />
          <StatCard 
            label="Salary Growth" 
            value={formatCurrency(metrics?.salary_growth)} 
            data-testid="stat-salary-growth"
          />
          <StatCard 
            label="Promotion Count" 
            value={formatNumberOrNA(metrics?.promotion_count)} 
            data-testid="stat-promotion-count"
          />
          <StatCard 
            label="Years Worked" 
            value={formatNumberOrNA(metrics?.years_worked)} 
            data-testid="stat-years-worked"
          />
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Salary Growth Chart</h3>
        <SalaryGrowthChart salaries={salaries} loading={loading} error={error} />
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Forecast</h3>
        <div className="metrics-grid">
          <StatCard 
            label="Average Nominal Increase" 
            value={formatCurrency(forecast?.average_nominal_increase)} 
          />
          <StatCard 
            label="Forecast 1 Year" 
            value={formatCurrency(forecast?.forecast_1_year)} 
          />
          <StatCard 
            label="Forecast 2 Year" 
            value={formatCurrency(forecast?.forecast_2_year)} 
          />
          <StatCard 
            label="Forecast 3 Year" 
            value={formatCurrency(forecast?.forecast_3_year)} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
