import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const MOCK_ANALYTICS = {
  traffic: [4500, 6700, 5200, 8900, 12000, 15600, 18000], // Last 7 days
  sources: [
    { label: 'Direct', value: 30 },
    { label: 'SEO', value: 45 },
    { label: 'Social', value: 15 },
    { label: 'Referral', value: 10 }
  ],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};

export const AdminGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'generator'>('analytics');
    const [topic, setTopic] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    // Simulate page load for animations
    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const generateBlog = async () => {
        setLoading(true);
        try {
            const apiKey = process.env.API_KEY || '';
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Write a comprehensive, high-value HTML blog post (minimum 1500 words) about: "${topic}". 
            
            Structure Requirements:
            - Use a catchy H1 title.
            - Use multiple H2 and H3 subheadings.
            - Write long, detailed paragraphs (150-200 words each).
            - Insert <img src="https://picsum.photos/seed/${topic.replace(/\s/g,'')}${Math.floor(Math.random()*100)}/800/400" alt="Contextual image" class="w-full rounded-xl my-8 shadow-lg" /> after every 2 paragraphs.
            - Include a 'Key Takeaways' list.
            - Tone: Professional, authoritative, human-like.
            - No generic filler text. Focus on actionable insights, statistics, and trends for 2025.
            
            Return ONLY the raw HTML body content (no <html> or <body> tags).`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            setGeneratedHtml(response.text || 'Error generating content.');
        } catch (e) {
            setGeneratedHtml('Error accessing Gemini API. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    // Helper for Radar Chart
    const getRadarCoordinates = (value: number, index: number, total: number, radius: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        return {
            x: 100 + Math.cos(angle) * (value / 100) * radius,
            y: 100 + Math.sin(angle) * (value / 100) * radius
        };
    };

    const radarPoints = MOCK_ANALYTICS.sources.map((src, i) => {
        const coords = getRadarCoordinates(src.value * 2, i, 4, 80); // Scale value for visuals
        return `${coords.x},${coords.y}`;
    }).join(' ');

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-white font-bold text-lg animate-pulse">Loading Admin Suite...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-24 pb-12 px-4 shadow-lg">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Admin Suite</h1>
                    <p className="text-slate-400">Welcome back, Zulqarnain. Here is your dashboard.</p>
                    
                    <div className="flex gap-6 mt-8 border-b border-slate-700">
                        <button 
                            onClick={() => setActiveTab('analytics')}
                            className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'analytics' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            Traffic Analytics
                        </button>
                        <button 
                            onClick={() => setActiveTab('generator')}
                            className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'generator' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            AI Content Generator
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                {activeTab === 'analytics' ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Bar Chart Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold text-lg text-slate-800">Weekly Traffic Overview</h3>
                                <div className="text-green-500 text-sm font-bold flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg>
                                    +12.5%
                                </div>
                            </div>
                            <div className="h-64 relative">
                                <svg className="w-full h-full" viewBox="0 0 700 300">
                                    {/* Grid Lines */}
                                    {[0, 1, 2, 3].map(i => (
                                        <line key={i} x1="0" y1={300 - (i * 100)} x2="700" y2={300 - (i * 100)} stroke="#f1f5f9" strokeWidth="1" />
                                    ))}
                                    
                                    {/* Bars */}
                                    {MOCK_ANALYTICS.traffic.map((val, i) => {
                                        const height = (val / 20000) * 300;
                                        const x = i * 100 + 25;
                                        const y = 300 - height;
                                        // Animation delay based on index
                                        const animationDelay = `${i * 100}ms`;
                                        
                                        return (
                                            <g key={i} onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)} className="group">
                                                {/* Animated Rect via CSS */}
                                                <style>
                                                    {`
                                                        @keyframes growBar${i} {
                                                            from { height: 0; y: 300; opacity: 0; }
                                                            to { height: ${height}px; y: ${y}px; opacity: 1; }
                                                        }
                                                    `}
                                                </style>
                                                <rect 
                                                    x={x} 
                                                    y={y} 
                                                    width="50" 
                                                    height={height} 
                                                    rx="6"
                                                    className={`fill-primary-600 transition-all duration-300 ${hoveredBar === i ? 'fill-primary-500' : 'opacity-90'}`}
                                                    style={{
                                                        animation: `growBar${i} 0.8s ease-out forwards`,
                                                        transformOrigin: 'bottom'
                                                    }}
                                                />
                                                <text x={x + 25} y="320" textAnchor="middle" className="fill-slate-400 text-xs font-bold">{MOCK_ANALYTICS.labels[i]}</text>
                                                
                                                {/* Tooltip */}
                                                {hoveredBar === i && (
                                                    <g className="animate-fade-in">
                                                        <rect x={x - 10} y={y - 40} width="70" height="30" rx="4" fill="#1e293b" />
                                                        <text x={x + 25} y={y - 20} textAnchor="middle" fill="white" className="text-xs font-bold">{val.toLocaleString()}</text>
                                                        <polygon points={`${x+25},${y-10} ${x+20},${y-15} ${x+30},${y-15}`} fill="#1e293b" transform="rotate(180)" />
                                                    </g>
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>

                        {/* Radar Chart Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
                             <div className="flex justify-between items-center mb-4 w-full">
                                <h3 className="font-bold text-lg text-slate-800">Traffic Sources</h3>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Last 30 Days</div>
                            </div>
                            <div className="w-64 h-64 relative">
                                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                                    {/* Background Web */}
                                    {[20, 40, 60, 80].map((r, i) => (
                                        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
                                    ))}
                                    
                                    {/* Data Polygon with Scale Animation */}
                                    <polygon 
                                        points={radarPoints} 
                                        fill="rgba(37, 99, 235, 0.2)" 
                                        stroke="#2563eb" 
                                        strokeWidth="2" 
                                        className="origin-center animate-[scaleIn_1s_ease-out]"
                                    />
                                    
                                    {/* Points and Labels */}
                                    {MOCK_ANALYTICS.sources.map((src, i) => {
                                        const coords = getRadarCoordinates(src.value * 2, i, 4, 80);
                                        const labelCoords = getRadarCoordinates(100, i, 4, 100); // Further out for labels
                                        return (
                                            <g key={i}>
                                                <circle cx={coords.x} cy={coords.y} r="4" fill="#2563eb" className="animate-pulse" />
                                                <text 
                                                    x={labelCoords.x} 
                                                    y={labelCoords.y} 
                                                    textAnchor="middle" 
                                                    className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider"
                                                    dominantBaseline="middle"
                                                >
                                                    {src.label} ({src.value}%)
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                {MOCK_ANALYTICS.sources.map((src, i) => (
                                    <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500 text-sm font-medium">{src.label}</span>
                                        <span className="font-bold text-slate-900">{src.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 h-[800px]">
                        <div className="flex flex-col gap-4 h-full">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Blog Topic</label>
                                <input 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                                    placeholder="e.g. The Future of Quantum Computing in 2025"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={generateBlog} 
                                disabled={loading || !topic}
                                className="bg-slate-900 text-white p-6 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Content...
                                    </>
                                ) : (
                                    'Generate 1500+ Word Blog Post'
                                )}
                            </button>
                            <div className="bg-slate-900 rounded-2xl flex-grow p-6 overflow-hidden flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400 font-mono text-xs uppercase">Raw HTML Output</span>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(generatedHtml)}
                                        className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700"
                                    >
                                        Copy HTML
                                    </button>
                                </div>
                                <textarea 
                                    readOnly
                                    value={generatedHtml}
                                    className="w-full h-full bg-slate-950 text-green-400 font-mono text-xs p-4 rounded-xl outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-8 border border-slate-200 rounded-3xl shadow-sm h-full overflow-y-auto prose prose-slate max-w-none custom-scrollbar">
                            {!generatedHtml ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <p className="font-medium">Preview will appear here</p>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}