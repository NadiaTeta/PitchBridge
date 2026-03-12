import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../data/userData';
import { handleApiError } from '../utils/errorHandler';

export function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = (roleParam === 'entrepreneur' || roleParam === 'investor' ? roleParam : null) as UserRole | null;
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { alert('Passwords do not match!'); return; }
    setLoading(true);
    try {
      await register({ name: formData.fullName, email: formData.email, password: formData.password, role: role! });
      navigate('/verify-email');
    } catch (err: unknown) {
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Centered Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,#020617_100%)] opacity-70" />
        <div className="relative z-10 text-center max-w-md">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-blue-500/20">P</div>
            <span className="text-white font-bold text-2xl tracking-tight">PitchBridge</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">Build the Future of Rwanda.</h2>
          <p className="mt-6 text-blue-100 text-lg">
            Join a community of {role === 'investor' ? 'visionary investors' : 'bold entrepreneurs'} dedicated to local growth.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 text-sm font-semibold py-2 px-4 bg-white/10 rounded-full border border-white/20">
               <CheckCircle2 className="w-4 h-4 text-blue-300" /> Secure Ecosystem
             </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="mb-6 p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h3>
          <p className="text-slate-500 mb-8 capitalize font-medium">Starting your journey as an <span className="text-blue-600 underline">{role}</span></p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                placeholder="Nadia TETA"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                placeholder="nadia@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95 mt-4"
            >
              {loading ? 'Creating account...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}