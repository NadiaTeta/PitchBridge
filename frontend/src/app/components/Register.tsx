import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../data/userData';
import { handleApiError } from '../utils/errorHandler';
import { validateEmailForRegistration } from '../utils/emailValidation';

export function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = (roleParam === 'entrepreneur' || roleParam === 'investor' ? roleParam : null) as UserRole | null;
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!role) {
      alert('Please choose an account type from the homepage (Entrepreneur or Investor).');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    const emailCheck = validateEmailForRegistration(formData.email);
    if (!emailCheck.valid) {
      alert(emailCheck.message || 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role,
      });
      navigate('/verify-email');
    } catch (err: unknown) {
      const message = handleApiError(err);
      alert(message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button type="button" onClick={() => navigate('/')} className="p-2 hover:bg-slate-800 rounded-lg text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-white">Create Account</h1>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Join as {role === 'entrepreneur' ? 'Entrepreneur' : role === 'investor' ? 'Investor' : '—'}
            </h2>
            <p className="text-slate-400 text-sm">Create your account to get started</p>
          </div>

          {!role && (
            <div className="mb-4 px-4 py-3 bg-amber-900/30 border border-amber-700/50 rounded-xl text-amber-200 text-sm">
              Go back to the homepage and choose &quot;I have an Idea&quot; (Entrepreneur) or &quot;I want to Invest&quot; (Investor) to create an account.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role && (
              <div>
                <label className="block text-sm mb-2 text-slate-300">Account Type</label>
                <div className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl">
                  <p className="capitalize font-medium text-white">{role}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2 text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your real email (no temporary addresses)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">We’ll send a verification code to this address. Use a real email you can access.</p>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold"
            >
              {loading ? 'Please wait...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
