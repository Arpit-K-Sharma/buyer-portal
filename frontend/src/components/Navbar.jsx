import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('bp_token');
    localStorage.removeItem('bp_user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">🏠 Buyer Portal</span>
      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/favourites"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          ❤ Favourites
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Profile
        </NavLink>
        <button className="nav-btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
