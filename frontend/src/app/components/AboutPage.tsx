import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Heart, Users, Zap } from 'lucide-react';
import { Footer } from './Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">About PitchBridge</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-8">
            PitchBridge connects Rwandan entrepreneurs with investors to turn ideas into reality and build a thriving innovation ecosystem.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              To empower Rwandan entrepreneurs with access to capital and mentorship while giving investors a transparent, verified pipeline of high-potential ventures—fostering trust, growth, and impact across the ecosystem.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Our Vision
            </h2>
            <p className="text-slate-600 leading-relaxed">
              A Rwanda where every viable business idea can find the right partners and funding, and where investors can confidently back verified entrepreneurs—driving job creation, innovation, and sustainable development.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              What We Believe
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Verified identity and documents build trust between entrepreneurs and investors.</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Direct connections and transparent terms lead to better deals and long-term partnerships.</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Rwanda’s entrepreneurial talent deserves a dedicated platform to access capital and grow.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
