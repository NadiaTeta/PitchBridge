import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export function EmailVerification() {
  const navigate = useNavigate();
  const { verifyEmail, user } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
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

  const handleResend = () => {
    alert('Verification code resent to your email!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {!verified ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="mb-2">Verify Your Email</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-blue-600">{user?.email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-3 text-center">Enter Verification Code</label>
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
                      className="w-12 h-14 text-center text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-colors mb-4"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Resend Code
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="mb-2">Email Verified!</h2>
              <p className="text-gray-600">
                Redirecting to document upload...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
