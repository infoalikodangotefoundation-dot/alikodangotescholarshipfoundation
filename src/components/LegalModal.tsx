import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

const content = {
  privacy: {
    title: 'Privacy Policy',
    text: `
      Last updated: March 2026
      
      This Privacy Policy describes how we collect, use, and handle your personal information when you use our scholarship application portal.
      
      1. Information We Collect
      We collect personal information such as your name, email, phone number, NIN, and academic records necessary for the scholarship application process.
      
      2. How We Use Your Information
      Your information is used solely for the purpose of evaluating your scholarship application, communicating with you regarding your application status, and verifying your identity.
      
      3. Data Security
      We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
      
      4. Third-Party Services
      We use third-party services like Paystack for payment processing. Your payment details are handled securely by these providers.
    `
  },
  terms: {
    title: 'Terms & Conditions',
    text: `
      Last updated: March 2026
      
      Please read these terms and conditions carefully before using our scholarship application portal.
      
      1. Acceptance of Terms
      By accessing and using this portal, you accept and agree to be bound by the terms and provision of this agreement.
      
      2. Eligibility
      This scholarship application is strictly for Nigerian citizens. You must provide a valid National Identification Number (NIN) to prove your eligibility.
      
      3. Application Fee
      A non-refundable application fee of ₦5,000 is required to process your application.
      
      4. Accuracy of Information
      You are responsible for ensuring that all information provided in your application is accurate, complete, and up-to-date. Providing false information will result in immediate disqualification.
      
      5. Disclaimer
      This platform is an independent scholarship application portal for Nigerians and is not officially affiliated with Aliko Dangote unless explicitly stated.
    `
  }
};

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const legalContent = content[type];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[90vw] max-h-[80vh] overflow-hidden flex flex-col bg-slate-900 border-slate-800 text-white p-0">
        <DialogHeader className="p-6 border-b border-slate-800">
          <DialogTitle className="text-2xl font-bold text-white">{legalContent.title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please review our {legalContent.title.toLowerCase()} carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-4">
            {legalContent.text.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={index} className="text-slate-300 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
