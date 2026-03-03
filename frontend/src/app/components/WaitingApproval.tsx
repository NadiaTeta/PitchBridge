import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Shield, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WaitingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // For demo purposes, add a button to simulate approval
  const handleSimulateApproval = () => {
    // In real app, this would be done by admin
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            {/* Clock Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>

            <h2 className="mb-2">Pending Admin Approval</h2>
            <p className="text-gray-600 mb-6">
              Your documents have been submitted successfully. Our admin team is reviewing your application.
            </p>

            {/* Status Timeline */}
            <div className="text-left mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Account Created</p>
                    <p className="text-xs text-gray-500">Email verified</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Documents Uploaded</p>
                    <p className="text-xs text-gray-500">Selfie & NIDA submitted</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm">Admin Review</p>
                    <p className="text-xs text-gray-500">Currently in progress...</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Approved</p>
                    <p className="text-xs text-gray-400">Pending...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex gap-2">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    <strong>You'll be notified via email</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    We'll send you an email at <strong>{user?.email}</strong> once your account is approved. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Button */}
            <button
              onClick={handleSimulateApproval}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors mb-3"
            >
              Simulate Approval (Demo)
            </button>

            <button
              onClick={logout}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
