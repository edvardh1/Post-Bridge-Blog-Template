'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Copy, Check } from 'lucide-react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')}
        className="text-gray-400 hover:text-gray-300 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </button>
      <button
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')}
        className="text-gray-400 hover:text-gray-300 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </button>
      <button
        onClick={copyToClipboard}
        className="text-gray-400 hover:text-gray-300 transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
      </button>
    </div>
  );
}
