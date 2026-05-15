import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { useState } from 'react';

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const links = [
    { name: 'Foods', href: '/' },
    { name: `Cart${totalItems > 0 ? ` (${totalItems})` : ''}`, href: '/cart' },
    { name: 'Orders', href: '/orders' },
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  if (!isAuthenticated) return null;

  return (
    <header className="fixed flex top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className=" mx-5 flex h-16 w-full items-center justify-between px-4">
        <button className="text-2xl font-bold" onClick={() => navigate('/')}>
          OnlineFoods.
        </button>

        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
          ☰
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((nav) => (
            <NavLink
              key={nav.name}
              to={nav.href}
              end={nav.href === '/'}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {nav.name}
            </NavLink>
          ))}
          <span className="mx-2 text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-2 border-t border-gray-200 px-4 py-3 md:hidden">
          {links.map((nav) => (
            <NavLink
              key={nav.name}
              to={nav.href}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`
              }
            >
              {nav.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-left text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
