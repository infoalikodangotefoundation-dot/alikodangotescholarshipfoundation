import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = "", 
  label 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={handleBack}
      className={`fixed top-[160px] md:top-[180px] left-4 md:left-8 z-[70] flex items-center justify-center gap-2 p-2 md:p-2.5 bg-white/50 backdrop-blur-md text-slate-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50 hover:bg-white/60 transition-all group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
      {label && <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider pr-1">{label}</span>}
    </motion.button>
  );
};
