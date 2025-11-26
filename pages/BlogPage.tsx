
import React from 'react';
import { BLOG_POSTS } from '../data';
import { NavigateFunction } from '../types';

export const BlogPage: React.FC<{ navigate: NavigateFunction }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Insights & Trends</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">Deep dives into the future of technology, career growth, and digital optimization.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.map(post => (
                    <div 
                        key={post.id} 
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
                    >
                        <div className="h-56 bg-slate-200 relative overflow-hidden">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                                {post.tags[0]}
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.author}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors">{post.title}</h2>
                            <p className="text-slate-500 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                            <div className="flex items-center text-primary-600 font-bold text-sm mt-auto group-hover:underline">
                                Read Article <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
