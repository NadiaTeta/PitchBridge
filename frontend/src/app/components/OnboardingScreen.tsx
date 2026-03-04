import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Target, Eye, ArrowRight } from 'lucide-react';
import { Footer } from './Footer';

export function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 min-h-[85vh] overflow-hidden">
        {/* Subtle Background Accent (No Shadow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-5xl w-full z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              Rwanda's Innovation Hub
            </span>
            <h1 className="text-white text-6xl md:text-7xl font-black tracking-tighter">
              Pitch<span className="text-blue-500">Bridge</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-xl mx-auto font-light leading-relaxed">
              Bridging the gap between visionary Rwandan founders and investment capital.
            </p>
          </div>

          {/* Action Cards: Flex Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Entrepreneur Card */}
            <button
              onClick={() => navigate('/register?role=entrepreneur')}
              className="group relative flex-1 bg-slate-800/40 border border-white/10 rounded-3xl p-8 text-left transition-all duration-300 hover:border-green-500/50 hover:bg-slate-800/60"
            >
              <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                <Lightbulb className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                I have an Idea <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Launch your startup journey. Showcase your vision to a curated network of verified investors.
              </p>
            </button>

            {/* Investor Card */}
            <button
              onClick={() => navigate('/register?role=investor')}
              className="group relative flex-1 bg-slate-800/40 border border-white/10 rounded-3xl p-8 text-left transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/60"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <TrendingUp className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                I want to Invest <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Discover high-potential Rwandan ventures. Access verified pitch decks and financial data.
              </p>
            </button>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-500 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-blue-500 pb-1"
            >
              Already have an account? <span className="text-blue-400">Log in here</span>
            </button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full px-6 py-20 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-blue-400 font-bold text-xs uppercase tracking-widest">
                <Target className="w-4 h-4" /> Mission
              </div>
              <p className="text-slate-300 leading-relaxed">
                Empowering Rwandan talent by democratizing access to capital and fostering a verified, transparent ecosystem for growth.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <Eye className="w-4 h-4" /> Vision
              </div>
              <p className="text-slate-300 leading-relaxed">
                To become the central pulse of East African innovation, where every viable idea meets the right strategic partner.
              </p>
            </div>

            {/* About Quick-Link */}
            <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest">Our Story</h3>
              <p className="text-slate-300 leading-relaxed">
                PitchBridge was built on the belief that talent is universal, but opportunity is not. We're changing that for Rwanda.
              </p>
              <button
                onClick={() => navigate('/about')}
                className="text-blue-400 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}