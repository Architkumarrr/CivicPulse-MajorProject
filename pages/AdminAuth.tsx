import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword, getIdTokenResult } from '../firebase';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';

const configuredAdmins = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

export default function AdminAuth() {
  const navigate = useNavigate();
  const { signInAdmin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const signedInEmail = result.user.email?.toLowerCase() || '';
      const tokenResult = await getIdTokenResult(result.user);
      const hasClaim = Boolean(tokenResult.claims.admin || tokenResult.claims.role === 'admin');
      const isAllowedEmail = configuredAdmins.length > 0 && configuredAdmins.includes(signedInEmail);

      if (!hasClaim && !isAllowedEmail) {
        await auth.signOut();
        throw new Error(configuredAdmins.length === 0
          ? 'Administrator access is not configured. Set VITE_ADMIN_EMAILS first or grant custom claims.'
          : 'This account is not authorized for the administrator portal.');
      }

      signInAdmin(result.user.uid, result.user.email || email);
      navigate('/admin');
    } catch (err: any) {
      setError(err?.code === 'auth/invalid-credential'
        ? 'Invalid administrator credentials.'
        : err?.message || 'Administrator sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d0a] flex flex-col justify-center relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />

      <main className="relative z-10 max-w-md w-full mx-auto px-6 py-24">
        <div className="glass-strong rounded-3xl p-8 border border-[#BA7517]/35 shadow-2xl">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#BA7517]/15 border border-[#BA7517]/35 flex items-center justify-center mx-auto mb-4 text-[#F5B84B]">
              <ShieldCheck size={23} />
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl text-text-primary">Administrator Sign In</h1>
            <p className="text-text-tertiary text-xs mt-2">Restricted access for municipal operations</p>
          </div>

          {error && <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-[11px] text-red-200 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#F5B84B] uppercase font-bold">ADMIN EMAIL</span>
              <span className="relative block">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="w-full bg-[#061410] rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary border border-[#BA7517]/25 focus:border-[#F5B84B]/60 outline-none" />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#F5B84B] uppercase font-bold">PASSWORD</span>
              <span className="relative block">
                <LockKeyhole size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input required type="password" value={password} onChange={event => setPassword(event.target.value)} className="w-full bg-[#061410] rounded-xl pl-10 pr-4 py-3 text-xs text-text-primary border border-[#BA7517]/25 focus:border-[#F5B84B]/60 outline-none" />
              </span>
            </label>

            <button disabled={loading} type="submit" className="w-full py-3.5 bg-[#BA7517] hover:bg-[#F5B84B] hover:text-black text-white font-grotesk font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50">
              {loading ? 'AUTHENTICATING...' : <>ENTER CONTROL CENTER <ArrowRight size={14} /></>}
            </button>
          </form>

          <button type="button" onClick={() => navigate('/auth')} className="w-full mt-5 text-[10px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
            Return to citizen sign in
          </button>
        </div>
      </main>
    </div>
  );
}
