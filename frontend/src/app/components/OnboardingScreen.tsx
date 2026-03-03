import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp } from 'lucide-react';

export function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
      style={{ 
        // Professional business/collaboration background image
        backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" 
      }}
    >
      {/* Dark Overlay & Blur for readability */}
      <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[2px]"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">Welcome to</h1>
          <h2 className="text-white text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            PitchBridge
          </h2>
          <p className="text-blue-100 text-lg font-medium opacity-90">
            Connecting Rwandan Entrepreneurs with Investors
          </p>
        </div>

        <div className="space-y-5">
          {/* Entrepreneur Track */}
          <button
            onClick={() => navigate('/register?role=entrepreneur')}
            className="w-full bg-green-600 hover:bg-green-500 text-white rounded-2xl p-6 transition-all transform hover:scale-[1.02] shadow-2xl group border border-white/10"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <Lightbulb className="w-10 h-10 group-hover:animate-pulse" />
              <span className="text-3xl font-bold">I have an Idea</span>
            </div>
            <p className="text-green-50 text-base opacity-90">
              Showcase your vision and secure funding
            </p>
          </button>

          {/* Investor Track */}
          <button
            onClick={() => navigate('/register?role=investor')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl p-6 transition-all transform hover:scale-[1.02] shadow-2xl group border border-white/10"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <TrendingUp className="w-10 h-10 group-hover:translate-y-[-2px] transition-transform" />
              <span className="text-3xl font-bold">I want to Invest</span>
            </div>
            <p className="text-blue-50 text-base opacity-90">
              Discover and back high-potential startups
            </p>
          </button>
        </div>

        {/* Footer/Admin Access */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-blue-200 hover:text-white text-sm font-medium transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            Administrator Access
          </button>
        </div>
      </div>
    </div>
  );
}