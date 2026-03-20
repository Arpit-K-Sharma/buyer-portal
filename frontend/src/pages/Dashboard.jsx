import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, favsRes] = await Promise.all([
          api.get('/properties'),
          api.get('/favourites'),
        ]);
        setProperties(propsRes.data.properties);
        const ids = new Set(favsRes.data.favourites.map((f) => f.id));
        setFavouriteIds(ids);
      } catch (err) {
        setError('Failed to load properties. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFavToggle = async (propertyId) => {
    const isCurrentlyFav = favouriteIds.has(propertyId);
    // Optimistic update
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFav) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });

    try {
      if (isCurrentlyFav) {
        await api.delete(`/favourites/${propertyId}`);
      } else {
        await api.post('/favourites', { property_id: propertyId });
      }
    } catch (err) {
      // Revert on error
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyFav) next.add(propertyId);
        else next.delete(propertyId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-wrapper">
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading properties…</span>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('bp_user') || '{"name":"User"}');

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name}</h1>
        <p className="page-subtitle">
          <span className="card-type-badge" style={{position: 'static', marginRight: '12px'}}>Role: Buyer</span>
          {properties.length} properties available — tap ❤ to save your favourites
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏘️</div>
          <h3>No properties found</h3>
          <p>Check back later for new listings.</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              isFavourited={favouriteIds.has(prop.id)}
              onFavToggle={handleFavToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
