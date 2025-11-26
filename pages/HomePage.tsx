import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { TOOLS, BLOG_POSTS, SUGGESTED_DOMAINS, GENERAL_FAQ } from '../data';
import { NavigateFunction } from '../types';

interface Props {
  navigate: NavigateFunction;
}

export const HomePage: React.FC<Props> = ({ navigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="select-none">
      {/* Premium Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-primary-100/40 to-white rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 text-center select-text">
          <div className="inline-block px-4 py-1.5 mb-6 bg-slate-900 text-white rounded-full text-xs font-bold tracking-wide uppercase shadow-lg animate-fade-in-down select-none">
            New Tools Added Daily
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-fade-in">
            Master Your Workflow with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Intelligent Tools</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed animate-fade-in delay-100">
            Access over 50+ premium developer, finance, and SEO utilities completely free. 
            Powered by AI, designed for humans.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in delay-200 select-none">
            <button onClick={() => navigate('/tools')} className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1">
              Explore Library
            </button>
            <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
              Request a Tool
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats - Adds "Age" Credibility */}
      <section className="bg-slate-900 py-10 border-y border-slate-800 select-none">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
                  <div>
                      <div className="text-3xl font-bold text-white mb-1">1M+</div>
                      <div className="text-slate-400 text-sm font-medium">Tools Used</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-white mb-1">50k+</div>
                      <div className="text-slate-400 text-sm font-medium">Monthly Users</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-white mb-1">150+</div>
                      <div className="text-slate-400 text-sm font-medium">Countries</div>
                  </div>
                  <div>
                      <div className="text-3xl font-bold text-white mb-1">2023</div>
                      <div className="text-slate-400 text-sm font-medium">Founded</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Tools Grid Preview */}
      <section className="py-20 bg-slate-50 select-none">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Tools</h2>
                <p className="text-slate-500">Most used by our community this week.</p>
            </div>
            <button onClick={() => navigate('/tools')} className="text-primary-600 font-medium hover:text-primary-700 hidden md:block">View All 50+ Tools &rarr;</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.slice(0, 6).map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => navigate(`/tool/${tool.slug}`)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                    <div 
                    className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-2"
                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                    />
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{tool.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{tool.name}</h3>
                <p className="text-slate-500 mb-4 text-sm line-clamp-2">{tool.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <button onClick={() => navigate('/tools')} className="text-primary-600 font-bold">View All 50+ Tools &rarr;</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white select-none">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Professionals Choose LuminaTools</h2>
                  <p className="text-slate-500 text-lg">We don't just build tools; we build productivity engines.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                  {[
                      { title: '100% Free Forever', desc: 'No hidden fees, no credit cards. We support our platform via unintrusive ads.' },
                      { title: 'Privacy Focused', desc: 'We process data locally on your device whenever possible. Your data stays yours.' },
                      { title: 'AI Powered', desc: 'Leveraging Google Gemini to provide intelligent insights, not just raw calculations.' }
                  ].map((feat, i) => (
                      <div key={i} className="text-center">
                          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-slate-200">
                              {i + 1}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                          <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-20 bg-slate-50 border-y border-slate-200 select-none">
          <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Developers & Creators</h2>
                  <p className="text-slate-500">See what our community has to say.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { name: "Sarah L.", role: "Digital Marketer", text: "I use the AI Keyword Generator daily. It has completely replaced my paid subscriptions. Incredible value.", date: "Member since May 2023" },
                      { name: "James K.", role: "Frontend Dev", text: "The CSS minifier and Color Converters are lifesavers. I keep this tab open all day while coding.", date: "Member since June 2023" },
                      { name: "Elena R.", role: "Content Writer", text: "The Article Rewriter helps me overcome writer's block instantly. Highly recommended for bloggers.", date: "Member since April 2023" }
                  ].map((t, i) => (
                      <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex gap-1 text-yellow-400 mb-4">
                              {'★★★★★'.split('').map((star, si) => <span key={si}>{star}</span>)}
                          </div>
                          <p className="text-slate-600 mb-6 italic">"{t.text}"</p>
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{t.name[0]}</div>
                              <div>
                                  <div className="font-bold text-slate-900">{t.name}</div>
                                  <div className="text-xs text-slate-400">{t.role} • {t.date}</div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900 text-white select-none">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
                  <div className="space-y-8">
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center font-bold">1</div>
                          <div>
                              <h4 className="font-bold text-lg mb-1">Search for a Utility</h4>
                              <p className="text-slate-400">Browse our categorized library of 50+ tools.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center font-bold">2</div>
                          <div>
                              <h4 className="font-bold text-lg mb-1">Enter Your Data</h4>
                              <p className="text-slate-400">Input your text, numbers, or keywords into the secure interface.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center font-bold">3</div>
                          <div>
                              <h4 className="font-bold text-lg mb-1">Get Instant Results</h4>
                              <p className="text-slate-400">Our algorithms and AI models process your request in milliseconds.</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="md:w-1/2 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                  {/* Mock UI */}
                  <div className="space-y-4">
                      <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                      <div className="h-12 bg-slate-900 rounded border border-slate-600"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                      <div className="h-24 bg-slate-900 rounded border border-slate-600"></div>
                      <button className="w-full h-12 bg-primary-600 rounded-lg"></button>
                  </div>
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white select-text">
          <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                  <p className="text-slate-500">Common questions about our platform and services.</p>
              </div>
              <div className="space-y-4">
                  {GENERAL_FAQ.map((faq, index) => (
                      <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden">
                          <button 
                              onClick={() => toggleFaq(index)}
                              className="w-full p-6 text-left bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center font-bold text-slate-800"
                          >
                              {faq.question}
                              <svg className={`w-5 h-5 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                          </button>
                          {openFaq === index && (
                              <div className="p-6 bg-white text-slate-600 leading-relaxed border-t border-slate-200 animate-fade-in">
                                  {faq.answer}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Developer Spotlight */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 select-none">
          <div className="container mx-auto px-4">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="md:w-1/3 text-center md:text-right">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Meet the Creator</h3>
                      <p className="text-slate-500">The mind behind LuminaTools.</p>
                  </div>
                  <div className="md:w-2/3 flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">Z</div>
                      <div>
                          <h4 className="text-xl font-bold text-slate-900">Zulqarnain</h4>
                          <p className="text-primary-600 font-bold text-sm uppercase tracking-wide mb-2">Founder of The Sellers Hub • Age 16</p>
                          <p className="text-slate-600 text-sm leading-relaxed">
                              "I built LuminaTools to prove that powerful software doesn't have to be expensive. 
                              Every line of code is optimized for speed and utility."
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-slate-50 select-text">
        <div className="container mx-auto px-4">
             <div className="flex justify-between items-end mb-12">
                 <div>
                     <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Insights</h2>
                     <p className="text-slate-500">Trends and technology updates.</p>
                 </div>
                 <button onClick={() => navigate('/blog')} className="text-primary-600 font-medium hover:text-primary-700">View All Articles &rarr;</button>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                 {BLOG_POSTS.slice(0, 3).map(post => (
                     <div key={post.id} onClick={() => navigate(`/blog/${post.slug}`)} className="cursor-pointer group">
                         <div className="rounded-2xl overflow-hidden mb-4 h-56 relative">
                             <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                                 <span className="text-xs font-bold text-white uppercase tracking-wider">{post.date}</span>
                             </div>
                         </div>
                         <div className="text-xs font-bold text-primary-600 mb-2 uppercase">{post.tags[0]}</div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                         <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>
                     </div>
                 ))}
             </div>
        </div>
      </section>

      {/* Domain Ideas */}
      <section className="py-12 bg-white border-t border-slate-200 select-none">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold mb-6 text-slate-700">Premium Domains for Sale</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {SUGGESTED_DOMAINS.map(d => (
                    <span key={d} className="px-4 py-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200 shadow-sm text-sm font-medium hover:border-primary-200 cursor-pointer transition-colors">{d}</span>
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};