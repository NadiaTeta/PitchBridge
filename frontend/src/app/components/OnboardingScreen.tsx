import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Target, Eye } from 'lucide-react';
import { Footer } from './Footer';

export function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Hero: no background image */}
      <section className="flex flex-col items-center justify-center p-6 min-h-[70vh] shrink-0">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold mb-2">Welcome to</h1>
            <h2 className="text-white text-5xl font-extrabold mb-6 tracking-tight">
              PitchBridge
            </h2>
            <p className="text-slate-300 text-lg font-medium">
              Connecting Rwandan Entrepreneurs with Investors
            </p>
          </div>

          <div className="space-y-5">
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

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      </section>

      {/* Full-width scrollable: Mission, Vision, About */}
      <section className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="w-full max-w-none mx-auto space-y-8 md:space-y-12">
          {/* Mission & Vision: full width row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-6 md:p-8 text-left">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-400 flex-shrink-0" />
                Our Mission
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                To empower Rwandan entrepreneurs with access to capital and mentorship while giving investors a transparent, verified pipeline of high-potential ventures—fostering trust, growth, and impact.
              </p>
            </div>
            <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-6 md:p-8 text-left">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-blue-400 flex-shrink-0" />
                Our Vision
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                A Rwanda where every viable business idea can find the right partners and funding, and where investors can confidently back verified entrepreneurs—driving job creation, innovation, and sustainable development.
              </p>
            </div>
          </div>

          {/* About: full width */}
          <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-6 md:p-8 text-left">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">About PitchBridge</h3>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
              PitchBridge connects Rwandan entrepreneurs with investors to turn ideas into reality and build a thriving innovation ecosystem.
            </p>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              We believe verified identity and documents build trust, direct connections lead to better deals, and Rwanda’s entrepreneurial talent deserves a dedicated platform to access capital and grow. You can read more on our{' '}
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
              >
                About page
              </button>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}