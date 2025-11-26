
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'Finance' | 'SEO' | 'Text' | 'Development' | 'AI' | 'Health' | 'Business';
  icon: string; // SVG string
  slug: string;
  metaTitle: string;
  metaDescription: string;
  longContent: string; // HTML content for SEO
  faq: { question: string; answer: string }[];
  isAiPowered?: boolean; // If true, uses the generic AI wrapper if no specific component exists
  promptTemplate?: string; // For generic AI tools
}

export interface Comment {
  id: string;
  user: string;
  date: string;
  content: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Full HTML content with images
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
  comments: Comment[];
  relatedTools: string[]; // IDs of tools to show in sidebar
}

export interface NavItem {
  label: string;
  path: string;
}

// Function type for navigation to ensure type safety
export type NavigateFunction = (path: string) => void;
