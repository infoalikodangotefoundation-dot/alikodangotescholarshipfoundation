import React from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { 
  CheckCircle2, 
  DollarSign, 
  Home, 
  Stethoscope, 
  Plane, 
  BookOpen, 
  Briefcase, 
  Globe, 
  LifeBuoy,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

const benefits = [
  {
    title: "Financial Coverage",
    icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
    description: "Experience complete peace of mind with our comprehensive financial support package.",
    points: [
      "100% Full tuition fees covered for the entire duration of your program",
      "Zero hidden charges or administrative fees",
      "Direct payment to the university on your behalf"
    ]
  },
  {
    title: "Monthly Allowance",
    icon: <DollarSign className="w-8 h-8 text-green-600" />,
    description: "We provide a consistent monthly stipend to ensure you can focus entirely on your studies.",
    points: [
      "$150 monthly stipend paid directly to your student account",
      "Covers daily feeding and local transportation costs",
      "Additional allowance for personal expenses and study materials"
    ]
  },
  {
    title: "Accommodation",
    icon: <Home className="w-8 h-8 text-green-600" />,
    description: "Live in safe, comfortable, and conducive environments near your campus.",
    points: [
      "Fully funded on-campus or approved off-campus housing",
      "Utilities and high-speed internet included",
      "Safe and secure student environments monitored 24/7"
    ]
  },
  {
    title: "Medical Support",
    icon: <Stethoscope className="w-8 h-8 text-green-600" />,
    description: "Your health is our priority. We ensure you have access to the best medical care.",
    points: [
      "Comprehensive international health insurance coverage",
      "Free healthcare services at university-affiliated clinics",
      "Regular medical checkups and mental health support"
    ]
  },
  {
    title: "Travel Support",
    icon: <Plane className="w-8 h-8 text-green-600" />,
    description: "We handle the logistics of getting you to your destination and back home.",
    points: [
      "Fully funded round-trip flight tickets (arrival and return)",
      "Visa application assistance and fee coverage",
      "Airport pickup and transition support upon arrival"
    ]
  },
  {
    title: "Academic Support",
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    description: "Access the resources and mentorship you need to excel academically.",
    points: [
      "Access to world-class libraries and research facilities",
      "Exclusive research grants and project funding",
      "One-on-one mentorship from industry leaders and academics"
    ]
  },
  {
    title: "Career Development",
    icon: <Briefcase className="w-8 h-8 text-green-600" />,
    description: "We prepare you for a successful global career after graduation.",
    points: [
      "Guaranteed internship opportunities at Dangote Group and partners",
      "Global networking events with professionals in your field",
      "Personalized career coaching and resume building workshops"
    ]
  },
  {
    title: "Global Exposure",
    icon: <Globe className="w-8 h-8 text-green-600" />,
    description: "Expand your horizons through international cultural and academic exchange.",
    points: [
      "Immersive study abroad experience in diverse cultures",
      "Participation in international conferences and seminars",
      "Connections with a global network of scholars and alumni"
    ]
  },
  {
    title: "Student Support",
    icon: <LifeBuoy className="w-8 h-8 text-green-600" />,
    description: "You are never alone. Our support team is available whenever you need help.",
    points: [
      "24/7 dedicated support system for all scholars",
      "Emergency financial and logistical assistance",
      "Cultural adjustment and integration workshops"
    ]
  }
];

export default function Benefits() {
  return (
    <div className="flex flex-col w-full bg-slate-50">
      <BackButton />
      {/* Hero Section */}
      <section className="relative py-20 bg-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1523050853063-915894367ef7?auto=format&fit=crop&q=80&w=2000" 
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
            Scholarship Benefits
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed"
          >
            The Aliko Dangote Foundation Scholarship offers full, comprehensive support to exceptional Nigerian students, 
            ensuring that financial barriers never stand in the way of world-class education and global leadership.
          </motion.p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-6 bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{benefit.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {benefit.description}
              </p>
              <ul className="space-y-3">
                {benefit.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Ready to Start Your Journey?</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Applications for the 2026/2027 academic year are now open. Join the next generation of global leaders.
          </p>
          <Link to="/apply">
            <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-12 h-16 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all group">
              Apply Now
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
