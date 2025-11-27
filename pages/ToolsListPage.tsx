import { Analytics } from "@vercel/analytics/react"
import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data';
import { AdSense } from '../components/AdSense';

interface Props {
  navigate: (path: string) => void;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Finance': 'Calculate profit, analyze investments, and manage financial planning with precision.',
  'SEO': 'Boost your search engine rankings with keyword research and optimization utilities.',
  'Text': 'Process, analyze, and format text content for web and documents.',
  'Development': 'Essential helpers for developers, from password generation to code utilities.',
  'AI': 'Next-generation tools powered by artificial intelligence to automate your workflow.',
  'Health': 'Tools for health and wellness tracking.',
  'Business': 'Tools to help grow and manage your business.'
};

export const ToolsListPage: React.FC<Props> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lumina_favorites') || '[]');
    setFavorites(saved);
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(id)) {
        newFavs = favorites.filter(fid => fid !== id);
    } else {
        newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('lumina_favorites', JSON.stringify(newFavs));
  };

  // Filter tools based on search term
  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tools by category
  const categories = Array.from(new Set(filteredTools.map(t => t.category)));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-4 bg-primary-50 text-primary-700 rounded-full text-xs font-bold tracking-wide uppercase">
            All Utilities
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Complete Tool Library
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            Browse our comprehensive collection of developer, SEO, and finance utilities. 
            Organized for quick access and designed for productivity.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all text-lg"
              placeholder="Search for a tool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories & Grids */}
        <div className="space-y-16">
          {categories.length === 0 && (
             <div className="text-center py-20 text-slate-500">
                <p className="text-xl font-medium">No tools found matching "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-primary-600 font-bold hover:underline">Clear Search</button>
             </div>
          )}

          {categories.map(category => (
            <div key={category} className="animate-fade-in">
              <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    {category}
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">
                        {filteredTools.filter(t => t.category === category).length}
                    </span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 max-w-xl">
                    {CATEGORY_DESCRIPTIONS[category] || 'Specialized utilities.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.filter(t => t.category === category).map(tool => (
                  <div 
                    key={tool.id} 
                    onClick={() => navigate(`/tool/${tool.slug}`)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button 
                            onClick={(e) => toggleFavorite(e, tool.id)}
                            className={`p-2 rounded-full bg-white shadow-sm border ${favorites.includes(tool.id) ? 'text-red-500 border-red-100' : 'text-slate-300 border-slate-100 hover:text-red-400'}`}
                        >
                            <svg className="w-5 h-5" fill={favorites.includes(tool.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 p-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                        dangerouslySetInnerHTML={{ __html: tool.icon }}
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {tool.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {tool.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tool</span>
                        <span className="text-primary-600 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                            Use Now &rarr;
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))})
        </div>

        {/* AdSense Advertisement */}
        <div className="mt-20 pt-12 border-t border-slate-100">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Featured Sponsors</h3>
                <p className="text-slate-500 text-sm">Supporting LuminaTools</p>
            </div>
            <AdSense className="w-full rounded-2xl overflow-hidden shadow-sm" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </div>
    </div>
  );
};
