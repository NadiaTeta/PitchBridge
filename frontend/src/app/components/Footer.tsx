import { Link } from 'react-router-dom';
import { Mail, MapPin, FileText, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-300 transition-colors">
              PitchBridge
            </Link>
            <p className="text-sm mt-2 text-slate-400">
              Connecting Rwandan entrepreneurs with investors to build the future.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors flex items-center gap-2">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/register?role=entrepreneur" className="text-sm hover:text-white transition-colors">
                  Register as Entrepreneur
                </Link>
              </li>
              <li>
                <Link to="/register?role=investor" className="text-sm hover:text-white transition-colors">
                  Register as Investor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:hello@pitchbridge.rw" className="hover:text-white transition-colors">
                  hello@pitchbridge.rw
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-700/50 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PitchBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
