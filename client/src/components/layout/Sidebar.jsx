import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/reports', label: 'Reports' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/70 p-4 backdrop-blur lg:block">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>
      </div>

      <nav className="space-y-1">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-sm font-semibold text-white">MVP scope</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          CSV, JSON, and XLSX analytics with private saved reports.
        </p>
      </div>
    </aside >
  );
}

export default Sidebar;