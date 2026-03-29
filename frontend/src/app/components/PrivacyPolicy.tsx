import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">P</div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Privacy Policy</h1>
              <p className="text-slate-400 text-xs">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 space-y-8">

          {/* Intro */}
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-4">
            <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 leading-relaxed">
              PitchBridge is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information in compliance with Rwanda's Law No. 058/2021 on the Protection of Personal Data and Privacy.
            </p>
          </div>

          <Section title="1. Who We Are">
            <p><strong>PitchBridge</strong> is a digital platform connecting Rwandan entrepreneurs and investors. We operate as the data controller for all personal information collected through the platform, accessible at <strong>pitchbridge.live</strong>.</p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect the following categories of personal data:</p>

            <SubSection title="2.1 Identity & Account Data">
              <ul className="list-disc pl-5 space-y-1">
                <li>Full name, email address, phone number</li>
                <li>Profile picture</li>
                <li>Role (entrepreneur or investor)</li>
                <li>Account password (stored as an encrypted hash — never in plain text)</li>
              </ul>
            </SubSection>

            <SubSection title="2.2 Verification Documents">
              <ul className="list-disc pl-5 space-y-1">
                <li>National Identity (NIDA) document or ID number</li>
                <li>Tax Identification Number (TIN)</li>
                <li>RDB Business Registration Certificate (where applicable)</li>
                <li>Selfie or identity verification photo</li>
              </ul>
              <p className="mt-2">These documents are used exclusively for identity verification and are stored securely on Cloudinary with restricted access.</p>
            </SubSection>

            <SubSection title="2.3 Project & Business Data">
              <ul className="list-disc pl-5 space-y-1">
                <li>Project name, description, category, and location</li>
                <li>Funding goals and ROI projections</li>
                <li>Pitch videos and project images</li>
              </ul>
            </SubSection>

            <SubSection title="2.4 Usage Data">
              <ul className="list-disc pl-5 space-y-1">
                <li>Login timestamps and session activity</li>
                <li>Pages visited and features used</li>
                <li>Messages exchanged between users on the platform</li>
                <li>Connection requests between investors and entrepreneurs</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use your personal data for the following purposes:</p>
            <table className="w-full mt-3 text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 border border-slate-200 font-bold text-slate-700">Purpose</th>
                  <th className="text-left p-3 border border-slate-200 font-bold text-slate-700">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Account creation and authentication', 'Contract performance'],
                  ['Identity verification (KYC)', 'Legal obligation / Legitimate interest'],
                  ['Connecting entrepreneurs with investors', 'Contract performance'],
                  ['Sending transactional emails (verification, approval)', 'Contract performance'],
                  ['Platform improvement and analytics', 'Legitimate interest'],
                  ['Compliance with Rwandan regulatory requirements', 'Legal obligation'],
                ].map(([purpose, basis], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3 border border-slate-200 text-slate-600">{purpose}</td>
                    <td className="p-3 border border-slate-200 text-slate-600">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="4. Data Sharing">
            <p>We do <strong>not sell</strong> your personal data. We may share data in the following limited circumstances:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Between users:</strong> Entrepreneur profiles and project information are visible to verified investors, and vice versa, as part of the platform's core function.</li>
              <li><strong className="text-slate-800">Service providers:</strong> We use Cloudinary (file storage), Resend (transactional email), and MongoDB Atlas (database). These providers process data solely on our behalf under data processing agreements.</li>
              <li><strong className="text-slate-800">Legal authorities:</strong> We may disclose data when required by Rwandan law, court order, or regulatory authority.</li>
              <li><strong className="text-slate-800">Business transfers:</strong> In the event of a merger or acquisition, user data may be transferred to the new entity subject to the same privacy protections.</li>
            </ul>
          </Section>

          <Section title="5. Data Storage & Security">
            <p>Your data is stored on secure cloud infrastructure. We implement the following security measures:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Passwords are hashed using industry-standard bcrypt encryption</li>
              <li>All data transmission uses HTTPS (TLS encryption)</li>
              <li>Verification documents are stored in restricted Cloudinary folders</li>
              <li>Access to admin systems is restricted to authorised personnel only</li>
              <li>JWT-based session authentication with expiry controls</li>
            </ul>
            <p className="mt-3">While we implement strong security measures, no system is completely immune to breach. In the event of a data breach affecting your rights, we will notify you as required by applicable law.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your data for as long as your account is active or as needed to provide services. Specific retention periods:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li><strong className="text-slate-800">Account data:</strong> Retained for the duration of your account plus 3 years after closure</li>
              <li><strong className="text-slate-800">Verification documents:</strong> Retained for 5 years to comply with KYC obligations under Rwandan financial regulations</li>
              <li><strong className="text-slate-800">Messages and activity logs:</strong> Retained for 2 years</li>
              <li><strong className="text-slate-800">Email logs:</strong> Retained for 1 year</li>
            </ul>
          </Section>

          <Section title="7. Your Rights">
            <p>Under Rwanda's Law No. 058/2021, you have the following rights regarding your personal data:</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { right: 'Right of Access', desc: 'Request a copy of the personal data we hold about you' },
                { right: 'Right to Rectification', desc: 'Request correction of inaccurate or incomplete data' },
                { right: 'Right to Erasure', desc: 'Request deletion of your data where there is no legal basis to retain it' },
                { right: 'Right to Restriction', desc: 'Request that we limit processing of your data in certain circumstances' },
                { right: 'Right to Portability', desc: 'Receive your data in a structured, machine-readable format' },
                { right: 'Right to Object', desc: 'Object to processing based on legitimate interests' },
              ].map(({ right, desc }) => (
                <div key={right} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1">{right}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">To exercise any of these rights, contact us at <strong>legal@pitchbridge.live</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Cookies & Tracking">
            <p>PitchBridge uses essential cookies and local storage for authentication and session management only. We do not use advertising cookies or third-party tracking pixels.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>PitchBridge is not intended for persons under the age of 18. We do not knowingly collect data from minors. If we become aware that a minor has registered, their account will be terminated immediately.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email and by posting the updated policy on the platform. Your continued use of PitchBridge after changes constitutes acceptance of the revised policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For privacy-related queries, requests, or complaints:</p>
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-1">
              <p><strong>PitchBridge Data Protection</strong></p>
              <p>Email: pitchbridge.support@gmail.com</p>
              <p>Website: https://nukita.netlify.app</p>
              <p>Location: Kigali, Rwanda</p>
            </div>
            <p className="mt-3 text-xs text-slate-400">You also have the right to lodge a complaint with Rwanda's National Cyber Security Authority (NCSA) or any competent data protection authority.</p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <div className="text-slate-600">{children}</div>
    </div>
  );
}