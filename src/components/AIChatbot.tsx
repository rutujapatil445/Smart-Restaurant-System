import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import { getGeminiApiKey } from '../lib/env';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Namaste! I'm your Saffron Spice assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { menu, settings } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = getGeminiApiKey();
      console.log("Chatbot: Using API Key (first 4 chars):", apiKey ? apiKey.substring(0, 4) + "..." : "MISSING");
      
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please ensure GEMINI_API_KEY is set in your .env file and you have RESTARTED the server.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare context for the AI
      const menuContext = (menu && menu.categories && menu.items) ? `
        Our Menu:
        ${menu.categories.map(cat => `
          Category: ${cat.name}
          Items:
          ${menu.items
            .filter(i => i.category_id === cat.id)
            .map(i => `- ${i.name} (₹${i.price}): ${i.description}${i.is_popular ? ' (Popular!)' : ''}${i.is_available ? '' : ' (Currently Unavailable)'}`)
            .join('\n')}
        `).join('\n')}
      ` : "Menu information is currently unavailable.";

      const restaurantContext = `
        Restaurant Name: ${settings?.restaurant_name || "Saffron Spice"}
        Tagline: ${settings?.tagline || "A premium Indian culinary destination"}
        Type: ${settings?.restaurant_type || "Indian Restaurant"}
        Address: ${settings?.address || "N/A"}
        Phone: ${settings?.phone || "N/A"}
        Email: ${settings?.email || "N/A"}
        Opening Hours: ${settings?.opening_hours || "N/A"}
        Primary Color: ${settings?.primary_color || "#ea580c"}
      `;

      const systemInstruction = `
        You are the AI assistant for "${settings?.restaurant_name || "Saffron Spice"}", a ${settings?.restaurant_type || "premium Indian restaurant"}.
        Your goal is to help customers with questions about the menu, reservations, loyalty program, and general inquiries.
        Be polite, helpful, and use a warm, welcoming tone (e.g., using "Namaste").
        
        ${restaurantContext}
        ${menuContext}
        
        If you don't know the answer, politely suggest they contact the restaurant directly at ${settings?.phone || "our phone number"}.
        Keep responses concise and helpful.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      console.log("AIChatbot: Received response:", response);
      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      let errorMessage = error instanceof Error ? error.message : "I'm having a bit of trouble connecting right now.";
      
      if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
        errorMessage = "API Quota Exceeded. You are using the free tier of Gemini API and have reached the limit. Please wait a few minutes or try again later.";
      }
      
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMessage}. Please ensure your API key is configured correctly.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-stone-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold">{settings?.restaurant_name || "Saffron Assistant"}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-stone-50/50 dark:bg-stone-950/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-stone-200 dark:bg-stone-800' : 'bg-orange-600 text-white'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-stone-900 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-sm border border-stone-100 dark:border-stone-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl rounded-tl-none shadow-sm border border-stone-100 dark:border-stone-700">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our menu, reservations..."
                  className="w-full pl-6 pr-14 py-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full text-sm outline-none focus:border-orange-600 transition-all text-stone-900 dark:text-white placeholder:text-stone-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full flex items-center justify-center hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-700 transition-all relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-4 px-4 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Ask Assistant
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatbot;
