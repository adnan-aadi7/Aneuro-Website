import { useState } from "react";

export default function TermsAndConditions({ onAgree }) {
  const [agreed, setAgreed] = useState(false);

  const handleCheckbox = () => setAgreed((prev) => !prev);
  const handleConfirm = () => {
    if (agreed) {
      if (onAgree) {
        onAgree();
      } else {
        alert("Thank you for agreeing to the Terms & Agreement.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#181A20] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl bg-[#181A20] rounded-lg shadow-lg p-6">
        <h1 className="text-cyan-400 text-2xl font-semibold text-center mb-1">Terms & Agreement</h1>
        <p className="text-gray-400 text-center mb-6">Effective Immediately</p>
        <div className="space-y-5 text-gray-300 text-sm">
          <div>
            <span className="font-bold text-cyan-300">1. Usage Rights & Access</span>
            <p>When you purchase or subscribe to any tier of our platform (Starter, Growth, or Enterprise), you agree to the following terms of use, licensing, conducting, and online initiatives. Please carefully review before using the platform.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">2. License Terms</span>
            <p>All content and features are offered for immediate access based on the platform and account. Users are not to resell, redistribute, or sublicense any portion, service, or module, unless so arranged for public sales, or legal prior delivery.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">3. Accessibility Tier</span>
            <p>Access is granted to the specific tools and/or tier platform(s) that have been purchased. Cloud File Access & File Share are only available to Enterprise users. Growth and Starter users are limited to their respective dashboards and features. All users are subject to the platform’s Acceptable Use Policy (AUP) and compliance requirements. Additional features & upgrades are subject to additional fees and/or approval.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">4. Tool Protection</span>
            <p>All tools are protected and only valid after full download. Downloading, saving, printing, or extracting these tools outside the platform is prohibited unless so authorized beforehand.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">5. Account Access & Delivery</span>
            <p>Platform users log in individually and are solely authorized. You are responsible for maintaining the confidentiality of your account credentials and are prohibited from sharing with unauthorized users.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">6. Cancellation Policy</span>
            <p>You may cancel your subscription at any time through your account dashboard. Access will remain active until the end of your billing cycle. No partial refunds are given for early cancellation.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">7. Payment Terms</span>
            <p>All payments are due in advance and require secure payment processes. Recurring billing terms may be enforced depending on subscription, and payment method on file will be charged automatically.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">8. Changes to Terms</span>
            <p>We reserve the right to update or modify these terms at any time. You will be notified of material changes via email or in-app notification.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">9. Privacy & Data Handling</span>
            <p>All user data is handled in strict accordance with our latest data policies. Your data will be used solely to provide services and improve the platform. We do not sell or share your data with third parties except where required by law.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">10. Governing Law & Dispute Resolution</span>
            <p>This agreement shall be governed by applicable law. Any disputes arising from the use of the platform shall be resolved through binding arbitration, except where prohibited by law.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">11. Intellectual Property Protection</span>
            <p>All platform content, logos, and materials are protected by applicable law, including the respective organization, user, design, platform, software, logos, and trademarks, which remain the property of Aneuro. You may not copy, reproduce or distribute any part of the system without written consent.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">12. Third-Party Integration Disclaimer</span>
            <p>Integration may connect to third-party platforms. Clicking Aneuro to available integration is at risk. Aneuro is not responsible for any issues, security, or downtime caused by third-party services or integrations beyond our control.</p>
          </div>
          <div>
            <span className="font-bold text-cyan-300">13. Severance Rights</span>
            <p>If any section, term, or clause is found unenforceable or invalid, we reserve the benefit to enforce all others. Including amendments, to ensure continuity of service and policy as required by law.</p>
          </div>
        </div>
        {/* Agreement Confirmation */}
        <div className="mt-8 flex flex-col items-center">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleCheckbox}
              className="form-checkbox h-4 w-4 text-cyan-400 rounded focus:ring-cyan-400 border-gray-600 bg-[#181A20]"
            />
            <span className="ml-2 text-gray-300 text-sm">
              I have read and agree to these Terms & Agreement, including the attached rules.
            </span>
          </label>
          <button
            onClick={handleConfirm}
            disabled={!agreed}
            className="w-full max-w-xs bg-cyan-400 text-gray-900 py-3 rounded-md font-semibold hover:bg-cyan-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
