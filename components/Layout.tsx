
import React, { useState, useEffect } from 'react';
import { NavItem, NavigateFunction } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Tools', path: '/tools' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
];

interface LayoutProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

export const Layout: React.FC<LayoutProps> = ({ children, navigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900 select-none">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center relative">
          <a href="#" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-2 group relative z-50">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">L</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Lumina<span className="text-primary-600">Tools</span></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={`#${item.path}`}
                onClick={(e) => handleNavClick(e, item.path)}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors relative"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-4">
            <button 
              onClick={(e) => handleNavClick(e, '/tools')}
              className="px-6 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-slate-700 p-2 relative z-50 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible delay-300'}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Sliding Panel */}
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
                <nav className="flex-1 space-y-3">
                    {NAV_ITEMS.map((item) => (
                    <a 
                        key={item.label} 
                        href={`#${item.path}`}
                        onClick={(e) => handleNavClick(e, item.path)}
                        className="block px-4 py-3 text-lg font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                    >
                        {item.label}
                    </a>
                    ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <button 
                        onClick={(e) => handleNavClick(e, '/tools')}
                        className="w-full py-4 text-center font-bold text-white bg-primary-600 rounded-xl shadow-lg hover:bg-primary-700 active:scale-95 transition-all"
                    >
                        Get Started
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                        &copy; 2023 LuminaTools
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-20 select-text">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 select-none relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
               <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center text-white font-bold text-sm">L</div>
                <span className="font-bold text-lg text-slate-800">LuminaTools</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering creators and developers with premium, free-to-use digital tools. Optimize your workflow today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => navigate('/tools')} className="hover:text-primary-600 transition-colors">Finance</button></li>
                <li><button onClick={() => navigate('/tools')} className="hover:text-primary-600 transition-colors">SEO</button></li>
                <li><button onClick={() => navigate('/tools')} className="hover:text-primary-600 transition-colors">Development</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => navigate('/about')} className="hover:text-primary-600 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-primary-600 transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-primary-600 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-primary-600 transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col items-center justify-center text-center text-sm text-slate-400">
            <p className="flex flex-col md:flex-row gap-2 items-center">
              <span>&copy; {new Date().getFullYear()} LuminaTools.</span>
              <span className="hidden md:inline">•</span>
              <span>This website Was Developed by <strong className="text-slate-500">The Sellers Hub</strong></span>
            </p>
          </div>
        </div>
        
        {/* Admin Button - Bottom Left, Hidden by default */}
        <div className="absolute bottom-4 left-4 z-10 opacity-0 hover:opacity-100 transition-opacity">
            <button 
                onClick={() => navigate('/admin')} 
                className="text-xs text-slate-300 hover:text-primary-600 font-medium cursor-pointer"
            >
                Admin
            </button>
        </div>
      </footer>
    </div>
  );
};
