import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Lock, Mail, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguageStore();
  const { loginAdmin } = useAppStore();
  const translations = t();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@cuisinedz.com');
  const [password, setPassword] = useState('admin123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError(language === 'ar' ? 'يرجى إدخال اسم المسؤول.' : 'Veuillez entrer votre nom.');
        return;
      }
      if (password.length < 6) {
        setError(language === 'ar' ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.' : 'Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (password !== confirmPassword) {
        setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Les mots de passe ne correspondent pas.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        loginAdmin(email);
        navigate('/admin/dashboard');
      } else {
        setError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Veuillez entrer une adresse e-mail et un mot de passe.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' 
              ? (language === 'ar' ? 'تسجيل دخول الإدارة' : language === 'en' ? 'Admin Portal Login' : translations.login)
              : (language === 'ar' ? 'إنشاء حساب مسؤول جديد' : language === 'en' ? 'Create Admin Account' : 'Créer un compte Admin')}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? (language === 'ar' ? 'الوصول إلى إدارة المنتجات، الطلبيات والمخزون.' : 'Accédez à la gestion des produits, commandes et stocks.')
              : (language === 'ar' ? 'أنشئ حساباً جديداً للوصول إلى لوحة تحكم المتجر.' : 'Créez un nouveau compte pour gérer la boutique.')}
          </p>
        </div>

        {/* Tab Switcher: Se connecter vs Créer un compte */}
        <div className="grid grid-cols-2 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setEmail('admin@cuisinedz.com');
              setPassword('admin123456');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Sign In' : 'Se connecter'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setEmail('');
              setPassword('');
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'إنشاء حساب جديد' : language === 'en' ? 'Create Account' : 'Créer un compte'}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {language === 'ar' ? 'الاسم الكامل' : language === 'en' ? 'Full Name' : 'Nom & Prénom'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عبد الباقي' : 'Ex: Abdelbaki'}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500"
              />
            </div>
          )}

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

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {language === 'ar' ? 'تأكيد كلمة المرور' : language === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>
              {loading
                ? (language === 'ar' ? 'جاري التحميل...' : 'Traitement...')
                : mode === 'login'
                ? (language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Sign In' : 'Se connecter')
                : (language === 'ar' ? 'إنشاء الحساب ودخول الإدارة' : language === 'en' ? 'Create Account & Enter Dashboard' : 'Créer le compte et accéder')}
            </span>
            {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            {language === 'ar' ? '← العودة إلى المتجر الرئيسي' : language === 'en' ? '← Back to store' : '← Retour à la boutique client'}
          </Link>
        </div>
      </div>
    </div>
  );
};
