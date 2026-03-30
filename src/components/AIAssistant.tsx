import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';

interface AIAssistantProps {
  onApplySuggestion: (text: string) => void;
  currentText: string;
}

export function AIAssistant({ onApplySuggestion, currentText }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleGenerate = async () => {
    if (!currentText || currentText.length < 50) {
      toast.error('Please write at least 50 characters before asking for AI assistance.');
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Improve the following personal statement for a scholarship application. Make it more professional, compelling, and grammatically correct. Do not change the core meaning or facts. Here is the text:\n\n${currentText}`,
      });
      
      if (response.text) {
        setSuggestion(response.text);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate AI suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          AI Personal Statement Assistant
        </h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-white w-full sm:w-auto"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Improve Text
        </Button>
      </div>
      
      {suggestion && (
        <div className="space-y-3">
          <div className="p-3 bg-white border border-green-200 rounded-md text-sm text-slate-600 whitespace-pre-wrap">
            {suggestion}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSuggestion('')}>
              Discard
            </Button>
            <Button size="sm" onClick={() => {
              onApplySuggestion(suggestion);
              setSuggestion('');
              toast.success('Applied AI suggestion');
            }}>
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
