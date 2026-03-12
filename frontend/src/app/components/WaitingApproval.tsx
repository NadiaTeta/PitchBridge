import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Shield, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WaitingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Brand Side: Centered Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_0%,#020617_100%)] opacity-70" />
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-blue-500/20">P</div>
            <span className="text-white font-bold text-2xl tracking-tight">PitchBridge</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">Verification in Progress.</h2>
          <p className="mt-6 text-blue-100 text-lg leading-relaxed">
            We're building a community of trust. Our team is manually reviewing your profile and documents to ensure the highest quality for our network.
          </p>
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase">
            <Shield className="w-4 h-4" /> SECURE HANDSHAKE PROTOCOL
          </div>
        </div>
      </div>

      {/* Right Side: Status Content */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center relative shadow-lg shadow-amber-100/50">
              <Clock className="w-12 h-12 text-amber-500 animate-[pulse_2s_infinite]" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center shadow-md">
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mb-2">Reviewing Details</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We've received your documents and identity data. Typical reviews take 12-24 hours.
            </p>
          </div>

          {/* Status Tracker */}
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 mb-8 space-y-6 shadow-sm">
            <StatusRow active title="Email Verification" description="Identity confirmed" />
            <StatusRow active title="Document Submission" description="Files uploaded safely" />
            <StatusRow pending title="Admin Final Approval" description="In queue for review" />
          </div>

          {/* Email Notification Info */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 flex gap-4 items-start mb-10">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
            <div>
                <p className="text-xs font-bold text-blue-900 uppercase tracking-tight mb-1">Notification System</p>
                <p className="text-sm text-slate-600">
                    We'll notify you at <span className="font-bold text-slate-900">{user?.email}</span> as soon as your account is active.
                </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-5 h-5" /> Log Out for Now
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">
                Need to update your documents? <button className="text-blue-600 underline font-bold">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ active, pending, title, description }: { active?: boolean; pending?: boolean; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
            {active ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
          </div>
          {/* Vertical line connector if not last item */}
          {!pending && <div className={`w-0.5 h-8 mt-1 rounded-full ${active ? 'bg-green-100' : 'bg-slate-100'}`} />}
      </div>
      <div className="pt-0.5">
        <h4 className={`text-sm font-bold tracking-tight ${active ? 'text-slate-900' : 'text-slate-400'} ${pending ? 'text-amber-600' : ''}`}>
            {title}
        </h4>
        <p className={`text-xs font-medium ${active ? 'text-slate-500' : 'text-slate-300'}`}>
            {description}
        </p>
      </div>
    </div>
  );
}