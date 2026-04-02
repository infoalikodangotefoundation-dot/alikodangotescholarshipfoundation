import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Users, Heart, UserPlus, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '../components/BackButton';
import { cn } from '@/lib/utils';

const options = [
  {
    id: 'myself',
    title: 'Myself',
    description: 'Apply for your own scholarship',
    icon: User,
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'family',
    title: 'Family Member',
    description: 'Apply for a sibling, child, or spouse',
    icon: Users,
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'relative',
    title: 'My Relative',
    description: 'Apply for a cousin, aunt, uncle, etc.',
    icon: Heart,
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'friend',
    title: 'Friend',
    description: 'Help a friend with their application',
    icon: UserPlus,
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'others',
    title: 'Others',
    description: 'Apply for someone else not listed',
    icon: HelpCircle,
    color: 'bg-red-50 text-red-600',
  },
];

export default function ApplicationSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const universityState = location.state as { selectedUniversity?: string };

  const handleSelection = (optionId: string) => {
    navigate('/apply', { 
      state: { 
        ...universityState,
        applyingFor: optionId 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-green-700 py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton className="text-white hover:bg-white/10" />
        </div>
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4"
          >
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[22px] sm:text-4xl font-bold text-white mb-4 whitespace-nowrap sm:whitespace-normal"
          >
            Who Are You Applying For?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-sm sm:text-base max-w-lg mx-auto"
          >
            Please select the relationship with the applicant <br className="sm:hidden" /> to help us tailor the application process.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={cn(
                "h-full",
                index === options.length - 1 && options.length % 2 !== 0 && "col-span-2 sm:col-span-1 max-w-[180px] mx-auto w-full sm:max-w-none"
              )}
            >
              <Card 
                className="group cursor-pointer hover:scale-[1.02] shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 border-white bg-white overflow-hidden h-full min-h-[150px] sm:min-h-0"
                onClick={() => handleSelection(option.id)}
              >
                <CardContent className="p-2.5 sm:p-6 flex flex-col items-center sm:items-start justify-center sm:justify-start text-center sm:text-left h-full">
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-[13px] sm:text-xl font-bold text-green-800 mb-1 sm:mb-2 transition-colors leading-tight">
                    {option.title}
                  </h3>
                  <p className="text-slate-500 text-[10px] sm:text-sm mb-2 sm:mb-6 flex-grow leading-tight">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start w-full mt-auto">
                    <div className="flex items-center bg-green-700 sm:bg-transparent text-white sm:text-green-700 px-2.5 py-1 sm:p-0 rounded-full sm:rounded-none font-bold text-[9px] sm:text-sm group-hover:translate-x-1 transition-all">
                      <span className="sm:inline">Continue</span> <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <Button
            onClick={() => navigate('/benefits')}
            className="bg-white text-green-700 hover:bg-green-50 font-bold px-8 py-6 rounded-2xl shadow-xl shadow-black/20 hover:scale-105 transition-all group"
          >
            <Award className="mr-2 w-6 h-6 group-hover:rotate-12 transition-transform" />
            Scholarship Benefits
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-white/60 text-sm">
            Learn more about what the scholarship covers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
            Aliko Dangote Foundation Scholarship Portal
          </p>
        </motion.div>
      </div>
    </div>
  );
}
