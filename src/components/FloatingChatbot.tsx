import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2,
  Maximize2,
  Minimize2,
  Sparkles,
  Search,
  ArrowRight,
  Phone,
  PhoneOff,
  User,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleGenAI, Modality } from '@google/genai';
import { useLocation } from 'react-router-dom';
import { universities } from '../data/universities';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "What are the scholarship benefits?",
  "Check application fee",
  "Call Assistant",
  "How do I apply?",
  "List partner universities"
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your Aliko Dangote Scholarship Assistant. I can help you with scholarships, universities, and applications. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'call'>('chat');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const location = useLocation();
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Text to Speech function
  const speak = (text: string) => {
    if (isMuted) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Try to find a good female voice if possible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Auto-popup logic
  useEffect(() => {
    const isHome = location.pathname === '/';
    const delay = isHome ? 3000 : 20000;

    const timer = setTimeout(() => {
      if (!hasScrolled) {
        setIsVisible(true);
        startAutoHideTimer();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true);
        setIsVisible(true);
        startAutoHideTimer();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Reset scroll trigger on page change
  useEffect(() => {
    setHasScrolled(false);
  }, [location.pathname]);

  // Listen for external open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsVisible(true);
    };
    window.addEventListener('open-chatbot', handleOpen);
    return () => window.removeEventListener('open-chatbot', handleOpen);
  }, []);

  const startAutoHideTimer = () => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = setTimeout(() => {
      if (!isOpen) {
        setIsVisible(false);
      }
    }, 30000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    if (text === 'Call Assistant') {
      setActiveMode('call');
      setInputText('');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API Key is missing');
      setMessages(prev => [...prev, {
        id: 'error-key',
        role: 'model',
        text: "Configuration error: API Key is missing. Please check your environment variables.",
        timestamp: new Date()
      }]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
        You are the Aliko Dangote Scholarship Foundation Assistant. 
        Your goal is to help students with information about the scholarship program, universities, and the application process.
        
        Key Information:
        - Scholarship: Aliko Dangote Foundation Scholarship Program 2026/2027.
        - Benefits: 100% tuition, $150 monthly stipend, accommodation, medical support, travel support, career development.
        - Application Fee: Standard fee is #5,000 (Naira).
        - Universities: We have 12 top partner universities including MIT, Harvard, Oxford, Cambridge, Stanford, Toronto, Melbourne, Tsinghua, Peking, Zhejiang, ETH Zurich, NUS.
        - Requirements: Academic excellence, Nigerian citizenship, personal statement, letters of recommendation.
        
        Guidelines:
        - Be professional, helpful, and encouraging.
        - If asked about general topics not related to the scholarship, you can answer them using your general knowledge.
        - Use Google Search grounding for up-to-date information if needed.
        - Keep responses concise but informative.
        - Mention that applications for 2026/2027 are currently open.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages
          .filter(m => m.id !== 'welcome' && m.id !== 'error' && m.id !== 'error-key')
          .slice(-6) // Keep last 6 messages for context to avoid large payloads on mobile
          .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })).concat([{ role: 'user', parts: [{ text: text }] }]),
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        }
      });

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. How else can I help?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
      if (activeMode === 'call') {
        speak(modelMessage.text);
      }
    } catch (error: any) {
      console.error('Chatbot Error:', error);
      const isNetworkError = !window.navigator.onLine;
      const errorMsg = isNetworkError 
        ? "You appear to be offline. Please check your internet connection." 
        : (error?.message?.includes('API_KEY_INVALID') 
          ? "Invalid API Key configuration. Please contact support." 
          : "I'm having some trouble connecting right now. Please try again in a moment.");
      
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'model',
        text: errorMsg,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          handleAudioInput(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording Error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioInput = async (base64Audio: string) => {
    setIsLoading(true);
    const apiKey = process.env.GEMINI_API_KEY;
    
    try {
      if (!apiKey) throw new Error('API Key missing');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: (messages
          .filter(m => m.id !== 'welcome' && m.id !== 'error' && m.id !== 'error-key')
          .slice(-6)
          .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })) as any[]).concat([{ 
            role: 'user', 
            parts: [
              { text: "Transcribe and answer this query related to the Aliko Dangote Scholarship Foundation." },
              { inlineData: { data: base64Audio, mimeType: 'audio/webm' } }
            ] 
          }]),
        config: {
          systemInstruction: "You are the Aliko Dangote Scholarship Assistant. Transcribe the audio and then provide a helpful response based on the scholarship details.",
          tools: [{ googleSearch: {} }]
        }
      });

      const modelMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: response.text || "I heard you, but I couldn't process the audio correctly.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
      if (activeMode === 'call') {
        speak(modelMessage.text);
      }
    } catch (error) {
      console.error('Audio Processing Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-[100] bottom-20 md:bottom-8 right-4 md:right-8 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`${
              isExpanded ? 'fixed inset-4 md:inset-auto md:bottom-24 md:right-8 md:w-[500px] md:h-[700px]' : 'w-[80vw] sm:w-[350px] md:w-[400px] h-[450px] md:h-[600px]'
            } bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 pointer-events-auto touch-none cursor-grab active:cursor-grabbing`}
          >
            {/* Header */}
            <div className="bg-[#ff0000] p-3 md:p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {activeMode === 'call' ? <Phone className="w-5 h-5 md:w-6 md:h-6 animate-pulse" /> : <Sparkles className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-xs md:text-base">
                    {activeMode === 'call' ? 'Voice Assistant' : 'Dangote AI'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                    <span className="text-[8px] md:text-[10px] text-white/80 uppercase tracking-wider font-medium">
                      {activeMode === 'call' ? 'On Call' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9 ${activeMode === 'call' ? 'bg-white/20' : ''}`}
                  onClick={() => setActiveMode(activeMode === 'chat' ? 'call' : 'chat')}
                >
                  {activeMode === 'chat' ? <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-slate-50"
            >
              {activeMode === 'call' && messages.length === 1 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 md:space-y-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-[#ff0000]/10 rounded-full flex items-center justify-center animate-pulse">
                    <Phone className="w-8 h-8 md:w-12 md:h-12 text-[#ff0000]" />
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-slate-800">Voice Mode</h4>
                    <p className="text-[10px] md:text-sm text-slate-500 max-w-[180px] mx-auto mt-1 md:mt-2">
                      Hold the mic to speak.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setActiveMode('chat')}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-white text-xs"
                  >
                    Switch to Chat
                  </Button>
                </div>
              )}

              {activeMode === 'chat' && messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-2.5 md:p-3 rounded-2xl text-[13px] md:text-sm relative group ${
                    m.role === 'user' 
                      ? 'bg-[#ff0000] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                    <div className={`text-[9px] md:text-[10px] mt-1 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {activeMode === 'call' && messages.length > 1 && messages.slice(-2).map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm md:text-base ${
                    m.role === 'user' 
                      ? 'bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20' 
                      : 'bg-white text-slate-700 shadow-md border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      {m.role === 'user' ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <Bot className="w-3 h-3 md:w-4 md:h-4" />}
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">
                        {m.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-2 md:p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-[#ff0000]" />
                    <span className="text-[10px] md:text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length < 3 && !isLoading && (
              <div className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 flex flex-wrap gap-1.5 md:gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[9px] md:text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-full hover:border-[#ff0000] hover:text-[#ff0000] transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full w-10 h-10 md:w-12 md:h-12 shrink-0 ${isRecording ? 'text-white bg-[#ff0000] animate-pulse' : 'text-slate-400 hover:text-[#ff0000] bg-slate-100'}`}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  {isRecording ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                </Button>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={activeMode === 'call' ? "Hold mic..." : "Type..."}
                    disabled={activeMode === 'call'}
                    className="w-full pl-3 pr-8 py-2 md:py-3 bg-slate-100 border-none rounded-xl md:rounded-2xl text-[13px] md:text-sm focus:ring-2 focus:ring-[#ff0000]/20 transition-all outline-none disabled:opacity-50"
                  />
                  {activeMode === 'chat' && (
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputText.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#ff0000] disabled:opacity-30 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="flex flex-col items-end gap-3 pointer-events-auto"
          >
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-2xl shadow-xl border border-slate-100 text-[11px] md:text-sm font-medium text-slate-700 mb-1 md:mb-2 flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-500 rounded-full animate-pulse" />
                Need help?
              </motion.div>
            )}
            <Button
              onClick={() => {
                setIsOpen(!isOpen);
                if (!isOpen) setIsVisible(true);
              }}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-grab active:cursor-grabbing ${
                isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#ff0000] hover:scale-110'
              }`}
            >
              {isOpen ? <X className="w-5 h-5 md:w-8 md:h-8" /> : <MessageCircle className="w-5 h-5 md:w-8 md:h-8" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
