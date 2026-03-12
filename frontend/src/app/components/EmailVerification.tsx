import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyEmail(code.join(''));
      setVerified(true);
      setTimeout(() => navigate('/upload-documents'), 1500);
    } catch (error) {
      alert('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Brand Side: Centered */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center p-12">
         <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mb-10 shadow-2xl">P</div>
         <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">Verification First.</h2>
         <p className="mt-6 text-slate-400 text-lg text-center">
           We've implemented multi-step authentication to protect our entrepreneurs and investors from unauthorized access.
         </p>
         <div className="mt-12 w-full max-w-xs p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-lg">
                <ShieldCheck className="text-green-600 w-6 h-6" />
            </div>
            <div className="text-left text-xs font-semibold text-slate-600">Your connection is fully encrypted.</div>
         </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md text-center">
          {!verified ? (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-slate-500 mb-10 text-lg">A 6-digit code was sent to <br/><span className="text-slate-900 font-bold">{user?.email}</span></p>

              <div className="flex gap-3 justify-center mb-10">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-12 h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 text-lg">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500">
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Success!</h2>
              <p className="text-slate-500 text-lg">Forwarding you to the next step...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}