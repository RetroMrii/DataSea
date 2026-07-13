import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext.jsx';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
];

const privateLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/reports', label: 'Reports' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
];

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = isAuthenticated ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Logo size={58} />

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sky-500/15 text-sky-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {isAuthenticated && (
            <>
              <span className="hidden shrink-0 max-w-48 truncate rounded-xl border border-slate-800 px-3 py-2 text-sm text-slate-300 md:inline">
                {user?.name || user?.email || 'User'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Navbar;