import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Lock, Mail, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguageStore();
  const { loginAdmin } = useAppStore();
  const translations = t();

  const [email, setEmail] = useState('admin@cuisinedz.com');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Standard credential check or demo instant bypass
    setTimeout(() => {
      if (email && password) {
        loginAdmin(email);
        navigate('/admin/dashboard');
      } else {
        setError('Veuillez entrer une adresse e-mail et un mot de passe.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {translations.login}
          </h1>
          <p className="text-xs text-slate-400">
            Accédez à la gestion des produits, commandes et stocks.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {translations.email}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domaine.com"
                className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {translations.password}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
            {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            ← Retour à la boutique client
          </Link>
        </div>
      </div>
    </div>
  );
};
