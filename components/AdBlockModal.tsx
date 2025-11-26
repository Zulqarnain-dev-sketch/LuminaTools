import React, { useEffect, useState } from 'react';

export const AdBlockModal: React.FC = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    // 1. Check for the bait element created in index.html
    const checkBait = () => {
      const bait = document.createElement('div');
      bait.className = 'ads-banner-test';
      bait.style.position = 'absolute';
      bait.style.left = '-9999px';
      bait.innerHTML = '&nbsp;';
      document.body.appendChild(bait);

      setTimeout(() => {
        if (bait.offsetParent === null || bait.offsetHeight === 0 || bait.offsetLeft === 0) {
          setAdBlockDetected(true);
        }
        document.body.removeChild(bait);
      }, 500);
    };

    // 2. Fetch check (Network layer blocking)
    const checkNetwork = async () => {
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors'
        });
      } catch (e) {
        setAdBlockDetected(true);
      }
    };

    checkBait();
    checkNetwork();
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center transform scale-100 animate-fade-in">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">AdBlock Detected</h2>
        <p className="text-slate-600 mb-6">
          Our tools are 100% free because they are supported by ads. Please disable your ad blocker or whitelist our site to continue using these premium tools.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          I've Disabled It (Refresh)
        </button>
        <p className="mt-4 text-xs text-slate-400">
          Detected by LuminaShield™ Technology
        </p>
      </div>
    </div>
  );
};
