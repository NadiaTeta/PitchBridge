import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export function EmailVerification() {
  const navigate = useNavigate();
  const { verifyEmail, user } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      alert('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(verificationCode);
      setVerified(true);
      setTimeout(() => {
        navigate('/upload-documents');
      }, 2000);
    } catch (error) {
      alert('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = user?.email;
    if (!email) {
      alert('Unable to resend: no email on file. Please log in again.');
      return;
    }
    setResendLoading(true);
    try {
      await api.post('/auth/resend-verification', { email });
      alert('A new verification code has been sent to your email. Please check your inbox.');
    } catch (err: any) {
      const message = handleApiError(err);
      alert(message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          {!verified ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="mb-2 text-white font-semibold text-xl">Verify Your Email</h2>
                <p className="text-slate-400 text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-blue-400 font-medium">{user?.email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-3 text-center text-slate-300">Enter Verification Code</label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-12 h-14 text-center text-2xl bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-xl transition-colors mb-4"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-blue-400 hover:text-blue-300 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="mb-2 text-white font-semibold text-xl">Email Verified!</h2>
              <p className="text-slate-400">
                Redirecting to document upload...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
