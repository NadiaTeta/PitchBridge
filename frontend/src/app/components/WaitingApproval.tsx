import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Shield, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WaitingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="text-center">
            {/* Clock Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>

            <h2 className="mb-2 text-white font-semibold text-xl">Pending Admin Approval</h2>
            <p className="text-slate-400 mb-6">
              Your documents have been submitted successfully. Our admin team is reviewing your application.
            </p>

            {/* Status Timeline */}
            <div className="text-left mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Account Created</p>
                    <p className="text-xs text-slate-500">Email verified</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Documents Uploaded</p>
                    <p className="text-xs text-slate-500">Selfie & NIDA submitted</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Admin Review</p>
                    <p className="text-xs text-slate-500">Currently in progress...</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Account Approved</p>
                    <p className="text-xs text-slate-500">Pending...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 mb-6 text-left">
              <div className="flex gap-2">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white mb-1">
                    <strong>You'll be notified via email</strong>
                  </p>
                  <p className="text-sm text-slate-300">
                    We'll send you an email at <strong className="text-white">{user?.email}</strong> once your account is approved. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
