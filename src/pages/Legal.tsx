import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../components/BackButton';

export default function Legal({ type }: { type: 'privacy' | 'terms' | 'refund' }) {
  const { t } = useTranslation();

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
    },
    refund: {
      title: 'Refund Policy',
      text: `
        Last updated: March 2026
        
        1. Non-Refundable Fee
        The application fee of ₦5,000 is strictly non-refundable.
        
        2. Exceptions
        Refunds will only be considered in the event of a technical error on our platform that results in multiple charges for a single application.
        
        3. Requesting a Refund
        If you believe you have been charged in error, please contact our support team within 7 days of the transaction with your payment reference number.
      `
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <BackButton />
      <h1 className="text-3xl font-bold text-slate-900 mb-8">{content[type].title}</h1>
      <div className="prose prose-slate max-w-none">
        {content[type].text.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-slate-700 leading-relaxed">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  );
}
