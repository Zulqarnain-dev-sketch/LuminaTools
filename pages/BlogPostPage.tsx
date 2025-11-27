
import React, { useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { BLOG_POSTS, TOOLS } from '../data';
import { AdSense } from '../components/AdSense';
import { NavigateFunction, Comment } from '../types';

interface Props {
  slug: string;
  navigate: NavigateFunction;
}

const SocialShare: React.FC<{ title: string }> = ({ title }) => {
    const [url, setUrl] = useState('');
    
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const shareLinks = [
        { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, color: 'bg-black text-white' },
        { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: 'bg-blue-600 text-white' },
        { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, color: 'bg-blue-700 text-white' }
    ];

    return (
        <div className="flex gap-2">
            {shareLinks.map(link => (
                <button 
                    key={link.name}
                    onClick={() => window.open(link.url, '_blank')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity ${link.color}`}
                >
                    Share on {link.name}
                </button>
            ))}
        </div>
    );
};

export const BlogPostPage: React.FC<Props> = ({ slug, navigate }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
        setComments(post.comments);
    }
  }, [slug, post]);

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    setIsPosting(true);
    
    // Simulate network delay
    setTimeout(() => {
        const newComment: Comment = {
            id: Date.now().toString(),
            user: "Guest User",
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            content: commentText,
            avatar: `https://ui-avatars.com/api/?name=Guest+User&background=random&color=fff`
        };

        setComments(prev => [...prev, newComment]);
        setCommentText('');
        setIsPosting(false);
        setPostSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setPostSuccess(false);
        }, 3000);
    }, 1500);
  };

  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
        {/* Article Header */}
        <div className="bg-slate-900 py-20 text-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wide">{tag}</span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">{post.title}</h1>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400 text-sm">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                            {post.author}
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>
                    <SocialShare title={post.title} />
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
                </div>
                
                {/* Content Injection */}
                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary-600 prose-img:rounded-2xl select-text">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Tags:</h4>
                    <div className="flex gap-2">
                        {post.tags.map(tag => (
                             <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 cursor-pointer">#{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-16 bg-slate-50 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8">Comments ({comments.length})</h3>
                    
                    <div className="space-y-6 mb-10">
                        {comments.length === 0 && <p className="text-slate-500 italic">No comments yet. Be the first!</p>}
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-4 animate-fade-in">
                                <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full bg-slate-200" />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-900">{c.user}</span>
                                        <span className="text-xs text-slate-400">{c.date}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Leave a Reply</h4>
                        
                        {postSuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2 animate-fade-in">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sm font-bold">Comment posted successfully!</span>
                            </div>
                        )}

                        <textarea 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full h-32 p-4 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all"
                            placeholder="Write your thought here..."
                            disabled={isPosting}
                        ></textarea>
                        
                        <button 
                            onClick={handlePostComment}
                            disabled={isPosting || !commentText.trim()}
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPosting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting...
                                </>
                            ) : (
                                'Post Comment'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-10">
                {/* Sidebar Tools */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Recommended Tools</h3>
                    <ul className="space-y-4">
                        {TOOLS.slice(0, 5).map(tool => (
                             <li key={tool.id}>
                                <button onClick={() => navigate(`/tool/${tool.slug}`)} className="flex items-start gap-3 group text-left w-full">
                                    <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0" dangerouslySetInnerHTML={{ __html: tool.icon }} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{tool.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                                    </div>
                                </button>
                             </li>
                        ))}
                    </ul>
                </div>

                {/* AdSense - sidebar ad (renders only on content pages) */}
                <div>
                  <AdSense className="w-full h-[400px] rounded-2xl overflow-hidden" />
                </div>

                {/* Newsletter */}
                <div className="bg-primary-600 p-8 rounded-2xl text-white text-center shadow-lg shadow-primary-500/30">
                    <h3 className="font-bold text-xl mb-2">Subscribe to News</h3>
                    <p className="text-primary-100 text-sm mb-6">Get the latest trends delivered to your inbox.</p>
                    <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-lg text-slate-900 mb-3 outline-none focus:ring-2 focus:ring-white/50" />
                    <button className="w-full py-3 bg-slate-900 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg">Subscribe</button>
                </div>
            </aside>
        </div>
    </div>
  );
};
