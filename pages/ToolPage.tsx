
import React, { useEffect, useState } from 'react';
import { TOOLS } from '../data';
import { RoiCalculator, WordCounter, KeywordGenerator, PasswordGenerator, KeyChecker, CPSTester, BinaryConverter, CaseConverter, LoremIpsumGenerator, JsonFormatter, ColorConverter } from '../components/Tools';
import { GoogleGenAI } from "@google/genai";

interface Props {
  slug: string;
  navigate: (path: string) => void;
}

/* --- HELPERS --- */
const useFavorites = (toolId: string) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem('lumina_favorites') || '[]');
        setIsFavorite(favs.includes(toolId));
    }, [toolId]);

    const toggleFavorite = () => {
        const favs = JSON.parse(localStorage.getItem('lumina_favorites') || '[]');
        let newFavs;
        if (favs.includes(toolId)) {
            newFavs = favs.filter((id: string) => id !== toolId);
            setIsFavorite(false);
        } else {
            newFavs = [...favs, toolId];
            setIsFavorite(true);
        }
        localStorage.setItem('lumina_favorites', JSON.stringify(newFavs));
        setIsFavorite(!isFavorite);
    };

    return { isFavorite, toggleFavorite };
};

/* --- TTS COMPONENT --- */
const TtsButton: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Cleanup on unmount or text change
        return () => {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        };
    }, [text]);

    const toggleSpeech = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            window.speechSynthesis.cancel(); // Cancel any existing speech
            
            // Clean text for speech (remove markdown chars, html tags, urls)
            const cleanText = text
                .replace(/[*#`_\[\]]/g, '') // Remove markdown chars
                .replace(/https?:\/\/\S+/g, 'link') // Replace URLs
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, 'and')
                .replace(/&lt;/g, 'less than')
                .replace(/&gt;/g, 'greater than')
                .replace(/(\r\n|\n|\r)/gm, '. '); // Replace newlines with pauses

            const newUtterance = new SpeechSynthesisUtterance(cleanText);
            newUtterance.rate = 1.0;
            newUtterance.pitch = 1.0;
            newUtterance.lang = 'en-US';
            
            newUtterance.onend = () => setIsSpeaking(false);
            newUtterance.onerror = () => setIsSpeaking(false);
            
            setUtterance(newUtterance);
            window.speechSynthesis.speak(newUtterance);
            setIsSpeaking(true);
        }
    };

    return (
        <button 
            onClick={toggleSpeech}
            className={`transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-medium px-3 py-1.5 rounded-full border shadow-sm ${isSpeaking ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200 hover:text-primary-600'} ${className}`}
            title={isSpeaking ? "Stop listening" : "Listen to content"}
            aria-label={isSpeaking ? "Stop listening" : "Listen to content"}
        >
            {isSpeaking ? (
                <>
                    <div className="relative w-4 h-4 flex items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <svg className="w-3 h-3 text-red-600 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </div>
                    <span className="text-xs font-bold">Stop</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-xs font-bold">Listen</span>
                </>
            )}
        </button>
    );
};

const SocialShare: React.FC<{ title: string }> = ({ title }) => {
    const [url, setUrl] = useState('');
    
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const shareLinks = [
        { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, color: 'hover:text-[#1DA1F2]' },
        { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: 'hover:text-[#4267B2]' },
        { name: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, color: 'hover:text-[#0077b5]' }
    ];

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share:</span>
            {shareLinks.map(link => (
                <button 
                    key={link.name}
                    onClick={() => window.open(link.url, '_blank')}
                    className={`p-2 rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-white hover:shadow-md ${link.color}`}
                    title={`Share on ${link.name}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={link.icon} />
                    </svg>
                </button>
            ))}
        </div>
    );
};

/* --- GENERIC AI TOOL COMPONENT --- */
const GenericAiTool: React.FC<{ tool: typeof TOOLS[0] }> = ({ tool }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const apiKey = process.env.API_KEY || '';
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${tool.promptTemplate} "${input}"`,
            });
            setResult(response.text || 'No response generated.');
        } catch (e) {
            setResult('Error generating content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Advanced Format Output with Code Blocks and better Markdown support
    const formatOutput = (text: string) => {
        if (!text) return '';
        
        let html = text
            // 1. Basic HTML Escaping
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

            // 2. Code Blocks (```code```)
            .replace(/```(\w+)?\s*([\s\S]*?)```/g, (match, lang, code) => 
                `<div class="my-6 relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
                    <div class="flex items-center justify-between bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-700">
                       <span class="uppercase">${lang || 'TEXT'}</span>
                    </div>
                    <pre class="p-4 overflow-x-auto text-slate-300 text-sm font-mono leading-relaxed custom-scrollbar"><code>${code.trim()}</code></pre>
                </div>`
            )
            
            // 3. Inline Code (`code`)
            .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200 shadow-sm">$1</code>')
            
            // 4. Headers
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2"><span class="w-1.5 h-6 bg-primary-500 rounded-full inline-block"></span>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">$1</h2>')
            
            // 5. Bold & Italic
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-slate-900 italic">$1</strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
            
            // 6. Blockquotes
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary-500 pl-6 italic text-slate-600 my-6 py-2 bg-slate-50 rounded-r-xl shadow-sm">$1</blockquote>')
            
            // 7. Lists
            .replace(/^\s*[\-\*]\s+(.*)$/gm, '<div class="flex gap-3 mb-2 items-start group"><span class="text-primary-500 text-lg leading-none mt-1 group-hover:scale-125 transition-transform">•</span><span class="flex-1 text-slate-700">$1</span></div>')
            .replace(/^\s*(\d+)\.\s+(.*)$/gm, '<div class="flex gap-3 mb-2 items-start"><span class="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded text-sm min-w-[24px] text-center border border-primary-100">$1</span><span class="flex-1 text-slate-700">$2</span></div>')
            
            // 8. Line Breaks
            .replace(/\n\n/g, '<br /><br />')
            .replace(/\n/g, '<br />');
            
        return html;
    };

    const handleCopy = () => {
        const cleanText = result.replace(/\*\*/g, '').replace(/```/g, '').replace(/`/g, '');
        navigator.clipboard.writeText(cleanText);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block font-medium text-slate-700 mb-2">{tool.description}</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Enter your text or keywords..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                    />
                    <button 
                        onClick={handleAction} 
                        disabled={loading}
                        className="px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Wait...' : 'Go'}
                    </button>
                </div>
            </div>
            {result && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-fade-in shadow-sm relative">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900">Result</h3>
                            <div className="h-4 w-px bg-slate-300"></div>
                            <TtsButton 
                                text={result} 
                                className="text-slate-500 hover:text-primary-600 transition-colors"
                            />
                        </div>
                        <button 
                            onClick={handleCopy} 
                            className="flex items-center gap-1.5 text-primary-600 text-sm font-bold hover:text-primary-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary-200 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Copy
                        </button>
                    </div>
                    <div 
                        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-normal" 
                        dangerouslySetInnerHTML={{ __html: formatOutput(result) }} 
                    />
                </div>
            )}
        </div>
    )
}

const ToolSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-12 animate-pulse">
    <div className="h-4 w-32 bg-slate-200 rounded mb-8"></div>
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="h-16 w-16 bg-slate-200 rounded-2xl"></div>
        <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-full bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="h-96 bg-slate-200 rounded-2xl"></div>
    </div>
  </div>
);

export const ToolPage: React.FC<Props> = ({ slug, navigate }) => {
  const tool = TOOLS.find(t => t.slug === slug);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites(tool?.id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);

    if (tool) {
      // Dynamic Title
      document.title = `${tool.metaTitle} | LuminaTools`;

      // Dynamic Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', tool.metaDescription);
    }
    
    return () => clearTimeout(timer);
  }, [slug, tool]);

  if (!tool) {
    return <div className="text-center py-20 text-xl text-slate-500">Tool not found. <button onClick={() => navigate('/tools')} className="text-primary-600 underline">Back to Tools</button></div>;
  }

  // JSON-LD Schema Construction
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
        "applicationCategory": tool.category,
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://lumina-tools.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://lumina-tools.vercel.app/#/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": tool.name
          }
        ]
      },
      // FAQ Schema
      ...(tool.faq.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": tool.faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }] : [])
    ]
  };

  const renderTool = () => {
    if (tool.id === 'roi-calculator') return <RoiCalculator />;
    if (tool.id === 'word-counter') return <WordCounter />;
    if (tool.id === 'ai-keyword-generator') return <KeywordGenerator />;
    if (tool.id === 'password-generator') return <PasswordGenerator />;
    if (tool.id === 'key-checker') return <KeyChecker />;
    if (tool.id === 'cps-tester') return <CPSTester />;
    if (tool.id === 'binary-converter') return <BinaryConverter />;
    if (tool.id === 'case-converter') return <CaseConverter />;
    if (tool.id === 'lorem-ipsum') return <LoremIpsumGenerator />;
    if (tool.id === 'json-formatter') return <JsonFormatter />;
    if (tool.id === 'color-converter') return <ColorConverter />;
    if (tool.isAiPowered) return <GenericAiTool tool={tool} />;
    return <div className="p-8 bg-yellow-50 text-yellow-800 rounded-xl">Tool implementation coming soon.</div>;
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      {loading ? <ToolSkeleton /> : (
        <>
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="text-sm text-slate-400 font-medium">
                <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Home</button> / 
                <button onClick={() => navigate('/tools')} className="mx-2 hover:text-primary-600 transition-colors">Tools</button> / 
                <span className="text-slate-900">{tool.name}</span>
            </div>
            <div className="flex items-center gap-4">
                <SocialShare title={`Use ${tool.name} for free on LuminaTools`} />
                <div className="h-4 w-px bg-slate-200"></div>
                <button 
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-all border ${isFavorite ? 'bg-red-50 text-red-500 border-red-100 shadow-inner' : 'bg-white text-slate-300 border-slate-200 hover:text-red-400 hover:border-red-200'}`}
                    title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                    <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <header className="mb-8">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg text-white p-4 shrink-0" dangerouslySetInnerHTML={{ __html: tool.icon }} />
                    <div className="pt-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{tool.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">{tool.category}</span>
                            <div className="h-4 w-px bg-slate-300"></div>
                            <TtsButton 
                                text={`${tool.name}. ${tool.description}`} 
                                className="text-slate-500 hover:text-primary-600 bg-slate-50 px-3 py-1 rounded-full text-xs border border-slate-200"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-xl text-slate-500 leading-relaxed mt-6">{tool.description}</p>
              </header>

              {/* Tool Canvas */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-12 relative overflow-hidden ring-1 ring-slate-900/5">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-indigo-500 to-primary-400" />
                 {renderTool()}
              </div>

              {/* SEO Content */}
              <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary-600">
                 <div dangerouslySetInnerHTML={{ __html: tool.longContent }} />
              </article>
              
              {/* FAQ Section */}
              {tool.faq.length > 0 && (
                <div className="mt-16 pt-16 border-t border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                    <div className="grid gap-4">
                        {tool.faq.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-primary-100 transition-colors">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-white shadow-sm text-primary-600 flex items-center justify-center text-sm font-bold border border-slate-100">?</span>
                                    {item.question}
                                </h3>
                                <p className="text-slate-600 pl-11">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
                {/* Ad Placeholder */}
                <div className="bg-slate-50 h-[300px] rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 relative overflow-hidden">
                    <span className="font-bold text-lg text-slate-300 z-10">ADVERTISEMENT</span>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes-light.png')] opacity-50"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-4">Related Tools</h3>
                    <ul className="space-y-2">
                        {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 5).map(t => (
                            <li key={t.id}>
                                <button onClick={() => navigate(`/tool/${t.slug}`)} className="w-full flex items-center gap-3 group p-2 rounded-xl hover:bg-slate-50 transition-all text-left">
                                    <span className="w-10 h-10 block bg-white border border-slate-100 p-2 rounded-lg text-primary-600 shadow-sm group-hover:scale-105 transition-transform" dangerouslySetInnerHTML={{ __html: t.icon }} />
                                    <div>
                                        <span className="text-slate-700 font-bold group-hover:text-primary-600 transition-colors text-sm block">{t.name}</span>
                                        <span className="text-slate-400 text-xs">Free Tool</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
