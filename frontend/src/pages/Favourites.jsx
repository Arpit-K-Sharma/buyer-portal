import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import PropertyCard from '../components/PropertyCard';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavourites = async () => {
    try {
      const res = await api.get('/favourites');
      setFavourites(res.data.favourites);
    } catch (err) {
      setError('Failed to load favourites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemove = async (propertyId) => {
    // Optimistic remove
    setFavourites((prev) => prev.filter((f) => f.id !== propertyId));
    try {
      await api.delete(`/favourites/${propertyId}`);
    } catch (err) {
      // Re-fetch on error
      fetchFavourites();
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-wrapper">
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading favourites…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">❤ My Favourites</h1>
        <p className="page-subtitle">
          {favourites.length} saved propert{favourites.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {favourites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤍</div>
          <h3>No favourites yet</h3>
          <p>Browse properties and tap ❤ to save them here.</p>
        </div>
      ) : (
        <div className="property-grid">
          {favourites.map((fav) => (
            <PropertyCard
              key={fav.id}
              property={fav}
              isFavourited={true}
              onFavToggle={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
