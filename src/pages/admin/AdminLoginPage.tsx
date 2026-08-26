import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Lock, Mail, ArrowRight, ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguageStore();
  const { loginAdmin } = useAppStore();
  const translations = t();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate strictly with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        let msg = authError.message;
        if (authError.message.includes('Invalid login credentials')) {
          msg = language === 'ar'
            ? 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور المسجلة في Supabase.'
            : 'Identifiants incorrects. Vérifiez l\'email et le mot de passe dans Supabase Auth.';
        } else if (authError.message.includes('Forbidden use of secret API key') || authError.message.includes('secret API key')) {
          msg = language === 'ar'
            ? 'خطأ في مفتاح Supabase: استخدم مفتاح anon public من لوحة تحكم Supabase.'
            : 'Erreur clé API : Veuillez utiliser la clé publique "anon public" dans votre configuration.';
        }
        setError(msg);
      } else if (data?.session && data?.user) {
        loginAdmin(data.user.email || email.trim());
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
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
            {language === 'ar' ? 'تسجيل دخول الإدارة' : language === 'en' ? 'Admin Portal Login' : translations.login}
          </h1>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'الوصول محمي ومخصص فقط للمسؤولين المسجلين في قاعدة بيانات Supabase.'
              : 'Accès sécurisé réservé aux administrateurs créés dans Supabase.'}
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
                placeholder="admin@votre-domaine.com"
                className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors"
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
                className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? (language === 'ar' ? 'جاري التحقق...' : 'Vérification...')
                : (language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Sign In' : 'Se connecter')}
            </span>
            {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Supabase Protected Notice */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ar'
              ? 'مصادقة آمنة عبر Supabase Auth.'
              : 'Authentification sécurisée gérée via Supabase Auth.'}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            {language === 'ar' ? '← العودة إلى المتجر' : language === 'en' ? '← Back to store' : '← Retour à la boutique client'}
          </Link>
        </div>
      </div>
    </div>
  );
};
