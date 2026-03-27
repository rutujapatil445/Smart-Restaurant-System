import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Loader2, 
  AlertCircle,
  FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiApiKey } from '../lib/env';

const AITools: React.FC = () => {
  const [hasSelectedKey, setHasSelectedKey] = useState(false);

  useEffect(() => {
    const checkKeyStatus = async () => {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasSelectedKey(hasKey);
      }
    };
    checkKeyStatus();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasSelectedKey(true);
    }
  };
  
  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageAnalysis(null);
      setImageError(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzingImage(true);
    setImageError(null);

    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please ensure your API key is configured correctly.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const reader = new FileReader();
      
      const base64Data = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedImage);
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: "Analyze this image in detail. Describe what you see, the colors, the mood, and any interesting elements." },
            { 
              inlineData: {
                mimeType: selectedImage.type,
                data: base64Data
              }
            }
          ]
        }
      });

      setImageAnalysis(response.text || "No analysis generated.");
    } catch (err: any) {
      console.error("Image analysis error:", err);
      let message = err.message || "Failed to analyze image.";
      
      if (message.includes("429") || message.toLowerCase().includes("quota")) {
        message = "API Quota Exceeded. You are using the free tier of Gemini API and have reached the limit. Please wait a few minutes or try again later.";
      }
      
      setImageError(message);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-serif font-bold tracking-tight mb-2">AI Creative <span className="text-orange-600 italic">Studio</span></h1>
            <p className="text-stone-500 text-sm uppercase tracking-[0.2em] font-bold">Harness the power of Gemini</p>
          </div>
          
          <div className="flex bg-stone-900/50 p-1 rounded-2xl border border-stone-800">
            {!hasSelectedKey && (
              <button 
                onClick={handleOpenKeySelector}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:bg-orange-500/10 transition-all mr-2"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Select API Key
              </button>
            )}
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-orange-600 text-white shadow-lg shadow-orange-600/20">
              <ImageIcon className="w-4 h-4" />
              Image Analysis
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Tool Controls */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-[2.5rem] bg-stone-900/30 border border-stone-800/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold">Image Analysis</h3>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-stone-800 bg-stone-950 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-orange-500/50 transition-all group overflow-hidden relative"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-stone-500 group-hover:text-orange-500 transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white mb-1">Click to upload</p>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest">JPG, PNG, WEBP up to 10MB</p>
                      </div>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  accept="image/*" 
                  className="hidden" 
                />

                <button 
                  onClick={analyzeImage}
                  disabled={isAnalyzingImage || !selectedImage}
                  className="w-full mt-8 py-5 rounded-2xl bg-orange-600 text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isAnalyzingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>

              {imageError && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-500 mb-1">Analysis Error</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">{imageError}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[500px] rounded-[3rem] bg-stone-950 border border-stone-800/50 overflow-hidden relative flex flex-col">
              <div className="flex-1 flex flex-col">
                <div className="p-8 border-b border-stone-800/50 flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold">Analysis Results</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Gemini 3 Flash</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {isAnalyzingImage ? (
                    <div className="space-y-6">
                      <div className="h-4 w-3/4 bg-stone-900 rounded-full animate-pulse" />
                      <div className="h-4 w-full bg-stone-900 rounded-full animate-pulse" />
                      <div className="h-4 w-5/6 bg-stone-900 rounded-full animate-pulse" />
                      <div className="h-4 w-2/3 bg-stone-900 rounded-full animate-pulse" />
                      <div className="pt-8 flex items-center gap-4">
                        <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Processing image data...</span>
                      </div>
                    </div>
                  ) : imageAnalysis ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="flex items-start gap-4 mb-8 p-4 rounded-2xl bg-orange-600/5 border border-orange-600/10">
                        <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                        <p className="text-sm text-stone-300 leading-relaxed italic">
                          "I've carefully examined the visual elements and context of the uploaded image. Here are my findings..."
                        </p>
                      </div>
                      <div className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                        {imageAnalysis}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                      <FileSearch className="w-16 h-16 mx-auto text-stone-700" />
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-700">Analysis will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
