const formatPrice = (price) => {
  const num = parseFloat(price);
  if (num >= 10000000) return `Rs ${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `Rs ${(num / 100000).toFixed(1)} Lakh`;
  return `Rs ${num.toLocaleString()}`;
};

const PropertyCard = ({ property, isFavourited, onFavToggle }) => {
  return (
    <div className="property-card">
      <div className="card-image-wrapper">
        <img
          src={property.image_url}
          alt={property.title}
          className="card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
          }}
        />
        <span className="card-type-badge">{property.type}</span>
        {onFavToggle && (
          <button
            className="card-fav-btn"
            onClick={() => onFavToggle(property.id)}
            title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            {isFavourited ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">📍 {property.location}</p>
        <div className="card-footer">
          <span className="card-price">{formatPrice(property.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
