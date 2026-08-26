import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Boxes, 
  Building2,
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Languages
} from 'lucide-react';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import type { Language } from '../types';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguageStore();
  const { settings, isAdminLoggedIn, loginAdmin, logoutAdmin } = useAppStore();
  const translations = t();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  const navItems = [
    { label: translations.dashboard, path: '/admin/dashboard', icon: LayoutDashboard },
    { label: translations.products, path: '/admin/products', icon: Package },
    { label: translations.orders, path: '/admin/orders', icon: ShoppingBag },
    { label: translations.stockManagement, path: '/admin/stock', icon: Boxes },
    { label: 'Fournisseurs', path: '/admin/suppliers', icon: Building2 },
    { label: translations.settings, path: '/admin/settings', icon: Settings },
  ];

  // Strictly verify Supabase Auth session on mount and route change
  React.useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          logoutAdmin();
          if (mounted) {
            setIsCheckingAuth(false);
            navigate('/admin/login', { replace: true });
          }
        } else {
          loginAdmin(data.session.user.email || 'Admin');
          if (mounted) {
            setIsCheckingAuth(false);
          }
        }
      } catch {
        logoutAdmin();
        if (mounted) {
          setIsCheckingAuth(false);
          navigate('/admin/login', { replace: true });
        }
      }
    };

    verifySession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, logoutAdmin, loginAdmin]);

  const handleLogout = async () => {
    logoutAdmin();
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    navigate('/admin/login', { replace: true });
  };

  // Loading state while verifying token
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-slate-400">Vérification des accès administrateur...</span>
      </div>
    );
  }

  // Prevent any rendering if unauthenticated
  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="./logo.png"
            alt="cuisineDZ"
            className="w-7 h-7 object-contain rounded-lg bg-white p-0.5"
          />
          <span className="font-bold text-sm">{settings.store_name} Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <img
              src="./logo.png"
              alt="cuisineDZ"
              className="w-11 h-11 object-contain rounded-xl bg-white p-1 shrink-0"
            />
            <div>
              <h2 className="text-white font-black text-base tracking-tight leading-tight">
                {settings.store_name}
              </h2>
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                {translations.admin}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          {/* Language selection in admin */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>Langue</span>
            </span>
            <div className="flex items-center gap-1">
              {(['fr', 'ar', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                    language === l ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Back to Customer Store */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>Voir la boutique</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>{translations.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
