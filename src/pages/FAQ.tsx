import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Search, MessageSquare, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '../components/BackButton';

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "Who is eligible for the Aliko Dangote Foundation Scholarship?",
        answer: "The scholarship is open to high-achieving Nigerian students who have gained admission or are applying to our partner global universities. We support both Undergraduate and Postgraduate (Masters/PhD) studies across various fields of study."
      },
      {
        question: "What does the scholarship cover?",
        answer: "Our scholarship is comprehensive. It covers 100% of tuition fees, a monthly stipend of $150 for living expenses, fully-funded accommodation, international health insurance, and round-trip flight tickets for the duration of the program."
      },
      {
        question: "Is the scholarship renewable?",
        answer: "Yes, the scholarship is renewable annually, provided the scholar maintains a minimum CGPA of 3.5 on a 5.0 scale (or equivalent) and continues to meet the foundation's standards of conduct."
      }
    ]
  },
  {
    category: "Application Process",
    questions: [
      {
        question: "How do I apply for the scholarship?",
        answer: "The application process is entirely online. Create an account on this portal, complete the multi-step application form with your personal, academic, and financial details, and submit it for review."
      },
      {
        question: "Is there an application fee?",
        answer: "Yes, a non-refundable processing fee of ₦5,000 is required to submit your application. This fee helps us maintain the platform and ensure that only serious candidates apply."
      },
      {
        question: "What documents are required for the application?",
        answer: "While some documents are now optional for the initial stage to facilitate faster processing, we strongly recommend uploading your Passport Photograph, Academic Certificates, and a Recommendation Letter. These will be mandatory for the final selection phase."
      },
      {
        question: "Can I edit my application after submission?",
        answer: "Yes, you can edit your application within 5 days of submission. After this window, your application will be locked for review by the selection committee."
      }
    ]
  },
  {
    category: "Selection & Results",
    questions: [
      {
        question: "How are scholars selected?",
        answer: "Selection is based on a combination of academic excellence, leadership potential, and demonstrated financial need. Our selection committee reviews each application thoroughly to identify the most deserving candidates."
      },
      {
        question: "When will the results be announced?",
        answer: "The selection process typically takes 4-6 weeks after the application deadline. All candidates will be notified of their status via email and through their portal dashboard."
      },
      {
        question: "Is there an interview process?",
        answer: "Shortlisted candidates will be invited for a virtual interview with the selection committee. This is an opportunity for us to learn more about your goals and aspirations."
      }
    ]
  },
  {
    category: "Financials",
    questions: [
      {
        question: "How is the stipend paid?",
        answer: "The monthly stipend of $150 is paid directly into the scholar's designated international student bank account at the beginning of each month."
      },
      {
        question: "Does the scholarship cover research costs?",
        answer: "Yes, for postgraduate scholars, the foundation provides additional grants to cover research-related expenses, including conference attendance and laboratory materials."
      }
    ]
  }
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <BackButton />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-800/50 rounded-full text-sm font-bold mb-6 border border-green-700"
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-50 max-w-2xl mx-auto mb-10"
          >
            Find answers to common questions about the Aliko Dangote Foundation Scholarship program.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              type="text"
              placeholder="Search for questions..."
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-slate-900 border-none shadow-xl focus-visible:ring-2 focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 container mx-auto px-4 max-w-4xl">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-12">
            {filteredFaqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-sm">
                    {catIndex + 1}
                  </span>
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const faqId = `${catIndex}-${index}`;
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        <button 
                          onClick={() => setOpenFaq(openFaq === faqId ? null : faqId)}
                          className="w-full p-6 text-left flex items-center justify-between gap-4 group"
                        >
                          <span className="text-lg font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                            {faq.question}
                          </span>
                          <div className={`p-2 rounded-full bg-slate-50 group-hover:bg-green-50 transition-colors ${openFaq === faqId ? 'rotate-180 bg-green-50 text-green-700' : 'text-slate-400'}`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </button>
                        <AnimatePresence>
                          {openFaq === faqId && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600">We couldn't find any questions matching "{searchQuery}".</p>
            <Button 
              variant="link" 
              className="mt-4 text-green-700 font-bold"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Still have questions?</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            If you can't find the answer you're looking for, please feel free to contact our support team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-sm text-slate-500 mb-4">Chat with our support team in real-time.</p>
              <Button 
                variant="outline" 
                className="rounded-full border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              >
                Start Chat
              </Button>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-sm text-slate-500 mb-4">Send us an email and we'll get back to you.</p>
              <a 
                href="mailto:info.alikodangotefoundation@gmail.com"
                className="inline-flex items-center justify-center rounded-full border border-green-600 text-green-700 hover:bg-green-50 px-6 py-2 text-sm font-medium transition-colors"
              >
                Send Email
              </a>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Phone Support</h3>
              <p className="text-sm text-slate-500 mb-4">Call us directly for urgent inquiries.</p>
              <a 
                href="tel:+234800DANGOTE"
                className="inline-flex items-center justify-center rounded-full border border-green-600 text-green-700 hover:bg-green-50 px-6 py-2 text-sm font-medium transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
