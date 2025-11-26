import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdBlockModal } from './components/AdBlockModal';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { ToolsListPage } from './pages/ToolsListPage';
import { LegalPage } from './pages/LegalPages';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminGenerator } from './pages/AdminGenerator';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    // Ensure hash starts with #/
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    window.location.hash = `#${cleanPath}`;
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    let path = route.replace(/^#/, '');
    
    // Normalize path
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    if (path === '' || path === '/') {
      return <HomePage navigate={navigate} />;
    }
    
    if (path === '/tools') {
      return <ToolsListPage navigate={navigate} />;
    }

    if (path.startsWith('/tool/')) {
        const slug = path.split('/tool/')[1];
        if (slug) return <ToolPage slug={slug} navigate={navigate} />;
    }

    if (path === '/blog') {
        return <BlogPage navigate={navigate} />;
    }

    if (path.startsWith('/blog/')) {
        const slug = path.split('/blog/')[1];
        if (slug) return <BlogPostPage slug={slug} navigate={navigate} />;
    }

    if (path === '/admin') {
        return <AdminGenerator />;
    }

    if (path === '/privacy') return <LegalPage type="privacy" />;
    if (path === '/terms') return <LegalPage type="terms" />;
    if (path === '/disclaimer') return <LegalPage type="disclaimer" />;

    // About Page
    if (path === '/about') {
      return (
        <div className="container mx-auto px-4 py-20 max-w-4xl animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">About LuminaTools</h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            LuminaTools is a premier destination for free, high-quality digital utilities.
            Founded in 2023, our mission is to democratize access to powerful SEO, financial, and developer tools.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                 <h3 className="font-bold text-xl mb-4 text-slate-800">Our Vision</h3>
                 <p className="text-slate-600">To become the world's most reliable repository of free software utilities, helping millions of users streamline their daily workflows.</p>
             </div>
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                 <h3 className="font-bold text-xl mb-4 text-slate-800">Our Tech Stack</h3>
                 <p className="text-slate-600">Built on Next.js 14, React 19, and powered by Google Gemini 2.5 AI for unparalleled performance and intelligent results.</p>
             </div>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
             <h2 className="text-2xl font-bold mb-6">Meet the Developer</h2>
             <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                 <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center font-bold text-3xl text-primary-400 shrink-0 border-4 border-slate-800">
                    Z
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-1">Zulqarnain</h3>
                    <p className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-4">Founder & Lead Developer • Age 16</p>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        A passionate full-stack developer and the founder of <strong className="text-white">The Sellers Hub Agency</strong>. 
                        Dedicated to building premium web experiences that solve real-world problems. 
                        LuminaTools is a testament to the power of modern web technologies and AI integration.
                    </p>
                    <div className="inline-block px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
                        Developed by <span className="text-white font-bold">The Sellers Hub</span>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      );
    }

    // Contact Page
    if (path === '/contact') {
      const [sending, setSending] = useState(false);
      const [sent, setSent] = useState(false);

      const handleSend = () => {
          setSending(true);
          setTimeout(() => {
              setSending(false);
              setSent(true);
          }, 2000);
      };

      return (
         <div className="container mx-auto px-4 py-20 max-w-2xl animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
            <p className="text-slate-600 mb-8">Have a suggestion or found a bug? We'd love to hear from you.</p>
            
            {sent ? (
                <div className="bg-green-50 text-green-700 p-8 rounded-2xl text-center border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                    <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you shortly.</p>
                    <button onClick={() => setSent(false)} className="mt-6 text-sm font-bold underline">Send another</button>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="Your name" required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none h-40 resize-none" placeholder="How can we help?" required></textarea>
                </div>
                <button disabled={sending} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center gap-2">
                    {sending ? 'Sending...' : 'Send Message'}
                </button>
                </form>
            )}
         </div>
      )
    }

    // 404
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-8xl font-bold text-slate-200 mb-4">404</h1>
            <p className="text-xl text-slate-600 mb-8 font-medium">Oops! That page doesn't exist.</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
              Return Home
            </button>
        </div>
    );
  };

  return (
    <>
      <AdBlockModal />
      <Layout navigate={navigate}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;