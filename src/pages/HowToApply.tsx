import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  BookOpen, 
  FileText, 
  Upload, 
  CreditCard, 
  Send,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '../components/BackButton';

const steps = [
  {
    title: "Create Your Account",
    icon: <UserPlus className="w-8 h-8 text-green-600" />,
    description: "Start by creating a secure account on our scholarship portal. You'll need a valid email address and a strong password.",
    details: [
      "Verify your email address to activate your account",
      "Keep your login credentials safe for future access",
      "Access your personalized dashboard"
    ]
  },
  {
    title: "Select Application Type",
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    description: "Choose whether you are applying for yourself or on behalf of a dependent/student.",
    details: [
      "Self-application for students",
      "Third-party application for parents/guardians",
      "Clear distinction for accurate record keeping"
    ]
  },
  {
    title: "Complete Application Form",
    icon: <FileText className="w-8 h-8 text-green-600" />,
    description: "Fill in your personal, academic, and financial information accurately across the 7-step form.",
    details: [
      "Personal details and contact information",
      "Academic history and intended course of study",
      "Financial background and reference details"
    ]
  },
  {
    title: "Upload Required Documents",
    icon: <Upload className="w-8 h-8 text-green-600" />,
    description: "Provide high-quality scans of your necessary documents to support your application.",
    details: [
      "Passport photograph (clear and recent)",
      "Academic certificates (WAEC, NECO, Degrees)",
      "Recommendation letters from academic or professional referees"
    ]
  },
  {
    title: "Pay Processing Fee",
    icon: <CreditCard className="w-8 h-8 text-green-600" />,
    description: "Pay the non-refundable processing fee of ₦5,000 to the designated foundation account.",
    details: [
      "Use the provided Opay account details",
      "Take a clear screenshot of the successful transaction",
      "Upload the proof of payment on the final step"
    ]
  },
  {
    title: "Submit and Track",
    icon: <Send className="w-8 h-8 text-green-600" />,
    description: "Review your information one last time and submit. You'll receive a unique Ticket ID.",
    details: [
      "Receive instant confirmation via email",
      "Use your Ticket ID to track status in real-time",
      "Edit your application within the 5-day window if needed"
    ]
  }
];

export default function HowToApply() {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <BackButton />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            How to Apply
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-50 max-w-3xl mx-auto leading-relaxed"
          >
            Your guide to a successful application for the Aliko Dangote Foundation Scholarship. 
            Follow our step-by-step process to join the next generation of global leaders.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
              >
                <div className="flex-1 w-full">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-xl">
                      {index + 1}
                    </div>
                    <div className="mb-6 bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-1 hidden md:block">
                  <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center text-slate-400">
                    <Info className="w-12 h-12 opacity-20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-2xl">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-yellow-600 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Important Information</h3>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• Ensure all uploaded documents are clear and legible.</li>
                  <li>• The processing fee is non-refundable and mandatory for final selection.</li>
                  <li>• You can save your progress at any step and return later.</li>
                  <li>• Double-check your NIN and Bank details as they are verified against national databases.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Ready to Begin?</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Your future starts here. Take the first step towards a world-class education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/apply-selection">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-12 h-16 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all group">
                Start Application
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/benefits">
              <Button size="lg" variant="outline" className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-12 h-16 text-xl rounded-full">
                View Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
