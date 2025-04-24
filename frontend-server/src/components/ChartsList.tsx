// src/components/ChartsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chartService } from '../services/chartService';

function ChartsList() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCharts() {
      try {
        setLoading(true);
        const response = await chartService.getCharts();
        setCharts(response.data || []);
      } catch (err) {
        setError('Failed to load charts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCharts();
  }, []);

  if (loading) return <div className="loading">Loading charts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="charts-list">
      <h1>Your Birth Charts</h1>
      
      <Link to="/chart/new" className="new-chart-button">
        Create New Chart
      </Link>
      
      {charts.length === 0 ? (
        <p>No charts found. Create your first chart!</p>
      ) : (
        <div className="charts-grid">
          {charts.map(chart => (
            <div key={chart.id} className="chart-card">
              <h3>{chart.name}</h3>
              <p>Born: {new Date(chart.birth_date).toLocaleDateString()}</p>
              <p>Time: {chart.birth_time}</p>
              <p>Place: {chart.birth_place}</p>
              <Link to={`/chart/${chart.id}`} className="view-button">
                View Chart
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChartsList;
