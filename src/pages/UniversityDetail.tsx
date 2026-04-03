import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { 
  MapPin, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Search, 
  Building2, 
  Trophy, 
  Briefcase, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { universities } from '../data/universities';

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const university = universities.find(u => u.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!university) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">University Not Found</h1>
        <Link to="/home">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    navigate('/apply-selection', { state: { selectedUniversity: university.name } });
  };

  return (
    <div className="min-h-screen bg-white">
      <BackButton />
      {/* Header Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden">
        <img 
          src={university.bannerImage} 
          alt={university.name} 
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <img 
                  src={`https://flagcdn.com/w40/${university.countryCode}.png`} 
                  alt={university.countryCode} 
                  className="w-6 sm:w-8 h-auto shadow-md rounded-sm"
                />
                <span className="text-base sm:text-lg md:text-xl font-medium text-white/90 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  {university.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg break-words">{university.name}</h1>
              <div className="flex items-center gap-2 sm:gap-4 text-yellow-400 font-semibold text-base sm:text-lg mb-6">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                {university.ranking}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={handleApply}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-12 sm:h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary-900/20 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  Apply to this University
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16 sm:space-y-24">
            {/* Overview Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">University Overview</h2>
              </div>
              
              <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="prose prose-slate prose-sm sm:prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed mb-6">
                    {university.overview}
                  </p>
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border-l-4 border-primary-600 shadow-sm">
                    <p className="font-semibold text-slate-900 italic">
                      "{university.reputation}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Programs Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-8 sm:mb-12">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">Academic Programs</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {university.programs.map((category, idx) => (
                  <div key={idx} className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                      {category.category}
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                        {category.courses.length} Courses
                      </span>
                    </h3>
                    <ul className="space-y-3 flex-grow">
                      {category.courses.map((course, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600 group-hover:text-slate-900 transition-colors">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Key Pillars Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            >
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Teaching Style</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{university.teachingStyle}</p>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Research Focus</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{university.researchOpportunities}</p>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Campus Facilities</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{university.facilities}</p>
              </div>
            </motion.section>

            {/* Why Choose Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 sm:p-16 text-white"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-12">Why Choose {university.name}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary-400 uppercase tracking-wider">Unique Advantages</h3>
                    <ul className="space-y-4">
                      {university.advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-sm sm:text-lg text-slate-200">
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                      <h3 className="text-xl font-bold text-primary-400 mb-4 flex items-center gap-3">
                        <Briefcase className="w-6 h-6" />
                        Career Path
                      </h3>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {university.careerOpportunities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Bottom Call to Action */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary-50 p-8 sm:p-12 rounded-[2.5rem] border border-primary-100 text-center space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Ready to start your journey at {university.name}?</h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Join hundreds of Aliko Dangote Scholars already studying at top institutions worldwide.
              </p>
              <Button 
                onClick={handleApply}
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all hover:scale-[1.05] active:scale-[0.95]"
              >
                Apply to {university.name} Now
              </Button>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Application Card */}
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <Clock className="w-6 h-6 text-primary-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Study Duration</h3>
                </div>
                
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-semibold text-slate-600">Undergraduate</span>
                    <span className="text-primary-700 font-bold px-3 py-1 bg-primary-50 rounded-lg">{university.durations.undergraduate}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-semibold text-slate-600">Masters</span>
                    <span className="text-primary-700 font-bold px-3 py-1 bg-primary-50 rounded-lg">{university.durations.masters}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-semibold text-slate-600">PhD</span>
                    <span className="text-primary-700 font-bold px-3 py-1 bg-primary-50 rounded-lg">{university.durations.phd}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleApply}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Apply Now
                </Button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  Applications open for 2026/2027
                </div>
              </div>

              {/* Foundation Support */}
              <div className="bg-primary-600 text-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary-200" />
                  Foundation Support
                </h4>
                <p className="text-primary-50 text-sm leading-relaxed relative z-10">
                  The Aliko Dangote Foundation provides 100% coverage for tuition, safe accommodation, and a comprehensive monthly stipend for all successful applicants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
