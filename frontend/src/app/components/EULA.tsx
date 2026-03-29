import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function EULA() {
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
              <h1 className="text-lg font-black tracking-tight">End-User Licence Agreement</h1>
              <p className="text-slate-400 text-xs">Last updated: March 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 space-y-8">

          {/* Intro */}
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-4">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              Please read this End-User Licence Agreement ("EULA") carefully before using PitchBridge. By registering or accessing the platform, you agree to be bound by these terms. If you do not agree, do not use the platform.
            </p>
          </div>

          <Section title="1. Parties">
            <p>This EULA is a legal agreement between you ("User") and <strong>PitchBridge</strong>, a digital platform developed and operated under the laws of the Republic of Rwanda. References to "we", "us" or "our" refer to PitchBridge.</p>
          </Section>

          <Section title="2. Grant of Licence">
            <p>Subject to your compliance with this EULA, PitchBridge grants you a limited, non-exclusive, non-transferable, revocable licence to access and use the platform solely for its intended purpose of connecting Rwandan entrepreneurs with investors.</p>
            <p className="mt-2">This licence does not permit you to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Copy, modify, or distribute any part of the platform</li>
              <li>Reverse engineer, decompile, or disassemble any software component</li>
              <li>Use the platform for any commercial purpose other than that for which it is designed</li>
              <li>Sublicense or resell access to the platform</li>
            </ul>
          </Section>

          <Section title="3. User Eligibility">
            <p>To use PitchBridge you must:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Be at least 18 years of age</li>
              <li>Be a resident of or legally operating within Rwanda or an eligible jurisdiction</li>
              <li>Provide accurate identity documentation (National ID / NIDA, TIN, or RDB registration as applicable)</li>
              <li>Not be prohibited by applicable law from using investment or financial technology platforms</li>
            </ul>
          </Section>

          <Section title="4. Account Registration & Verification">
            <p>PitchBridge uses a tiered verification model:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Bronze:</strong> National Identity (NIDA) verification</li>
              <li><strong className="text-slate-800">Silver:</strong> NIDA + Tax Identification Number (TIN)</li>
              <li><strong className="text-slate-800">Gold:</strong> NIDA + TIN + RDB Business Registration or Cooperative Endorsement</li>
            </ul>
            <p className="mt-3">You are responsible for the accuracy of all information submitted. Providing false or misleading information is grounds for immediate account termination and may expose you to legal liability under Rwandan law.</p>
          </Section>

          <Section title="5. Platform Use & Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Post false, misleading, or fraudulent project information</li>
              <li>Solicit funds outside the platform after connecting through PitchBridge</li>
              <li>Harass, abuse, or intimidate other users</li>
              <li>Upload malicious files, viruses, or harmful content</li>
              <li>Engage in money laundering, fraud, or any activity prohibited under Rwanda's financial laws</li>
              <li>Use automated bots or scrapers to extract platform data</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </Section>

          <Section title="6. Investment Disclaimer">
            <p>PitchBridge is a <strong>connection and information platform only</strong>. We do not:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Guarantee the accuracy of any entrepreneur's financial projections or ROI claims</li>
              <li>Endorse, underwrite, or guarantee any investment opportunity listed on the platform</li>
              <li>Act as a licensed investment advisor or financial institution</li>
              <li>Accept liability for any financial loss arising from investment decisions made through the platform</li>
            </ul>
            <p className="mt-3">All investment decisions are made at your own risk. Users are encouraged to conduct independent due diligence before committing funds.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content, branding, software, and design elements of PitchBridge are the exclusive property of PitchBridge and are protected under applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
            <p className="mt-2">Content you submit (pitch decks, project descriptions, videos) remains your property. By submitting content, you grant PitchBridge a non-exclusive licence to display and share it with relevant users on the platform.</p>
          </Section>

          <Section title="8. Account Suspension & Termination">
            <p>PitchBridge reserves the right to suspend or permanently terminate your account at any time if:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>You breach any provision of this EULA</li>
              <li>Your verification documents are found to be fraudulent</li>
              <li>Your conduct is deemed harmful to other users or the platform</li>
              <li>Requested by a competent Rwandan authority</li>
            </ul>
            <p className="mt-2">You may terminate your account at any time by contacting support. Upon termination, your right to access the platform ceases immediately.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by Rwandan law, PitchBridge shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of or inability to use the platform.</p>
          </Section>

          <Section title="10. Governing Law & Dispute Resolution">
            <p>This EULA is governed by the laws of the <strong>Republic of Rwanda</strong>. Any disputes arising from this agreement shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to the competent courts of Rwanda.</p>
          </Section>

          <Section title="11. Amendments">
            <p>We reserve the right to update this EULA at any time. Continued use of the platform after any changes constitutes your acceptance of the revised terms. We will notify registered users of material changes via email.</p>
          </Section>

          <Section title="12. Contact">
            <p>For questions regarding this EULA, contact us at:</p>
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-1">
              <p><strong>PitchBridge Support</strong></p>
              <p>Email: pitchbridge.support@gmail.com</p>
              <p>Website: https://nukita.netlify.app</p>
              <p>Location: Kigali, Rwanda</p>
            </div>
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