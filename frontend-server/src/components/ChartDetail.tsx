
// src/components/ChartDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chartService } from '../services/chartService';

function ChartDetail() {
  const { id } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadChartDetail() {
      try {
        setLoading(true);
        const response = await chartService.getChartDetail(id);
        setChartData(response.data);
      } catch (err) {
        setError('Failed to load chart details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadChartDetail();
  }, [id]);

  if (loading) return <div className="loading">Loading chart details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!chartData) return <div className="not-found">Chart not found</div>;

  const { chart, planets, houses } = chartData;

  return (
    <div className="chart-detail">
      <div className="chart-header">
        <h1>{chart.name}'s Birth Chart</h1>
        <div className="chart-meta">
          <p>Born: {new Date(chart.birth_date).toLocaleDateString()} at {chart.birth_time}</p>
          <p>Location: {chart.birth_place}</p>
          <p>Coordinates: {chart.latitude}, {chart.longitude}</p>
        </div>
      </div>

      <div className="chart-sections">
        <div className="chart-section">
          <h2>Planets</h2>
          <div className="planets-grid">
            {planets.map(planet => (
              <div key={planet.id} className="planet-card">
                <h3>{planet.name}</h3>
                <p>Sign: {planet.sign}</p>
                <p>House: {planet.house}</p>
                <p>Degrees: {planet.longitude.toFixed(2)}°</p>
                {planet.retrograde && <p className="retrograde">Retrograde</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h2>Houses</h2>
          <div className="houses-grid">
            {houses.map(house => (
              <div key={house.id} className="house-card">
                <h3>House {house.house_number}</h3>
                <p>Sign: {house.sign}</p>
                <p>Degrees: {house.longitude.toFixed(2)}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-actions">
        <Link to="/" className="back-button">
          Back to Charts
        </Link>
      </div>
    </div>
  );
}

export default ChartDetail;
