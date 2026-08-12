'use client';

import { useState, useEffect } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    band: `https://band.us/plugin/share?body=${encodeURIComponent(title + ' ' + url)}&route=${encodeURIComponent(url)}`,
    naver: `https://share.naver.com/web/shareView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    kakao: `https://story.kakao.com/share?url=${encodeURIComponent(url)}` // 임시 카카오스토리 공유
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-4">
      <div className="border border-violet-100 bg-violet-50/50 rounded-full py-4 px-6 shadow-sm flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {/* Facebook */}
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-[#1877F2] text-white rounded-xl flex items-center justify-center text-xl hover:scale-110 transition shadow-sm">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        
        {/* X (Twitter) */}
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl hover:scale-110 transition shadow-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>

        {/* Telegram */}
        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-[#0088cc] text-white rounded-xl flex items-center justify-center text-xl hover:scale-110 transition shadow-sm">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.896-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        </a>

        {/* Band */}
        <a href={shareLinks.band} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-[#00C63B] text-white rounded-xl flex items-center justify-center font-bold text-[10px] hover:scale-110 transition shadow-sm">
          BAND
        </a>

        {/* Naver */}
        <a href={shareLinks.naver} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-[#03C75A] text-white rounded-xl flex items-center justify-center font-bold text-2xl hover:scale-110 transition shadow-sm">
          N
        </a>

        {/* Kakao */}
        <a href={shareLinks.kakao} target="_blank" rel="noopener noreferrer" 
           className="w-12 h-12 bg-[#FEE500] text-[#000000] rounded-xl flex items-center justify-center text-xl hover:scale-110 transition shadow-sm">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-5.523 0-10 3.477-10 7.767 0 2.766 1.777 5.185 4.425 6.471-.144.502-.455 1.579-.492 1.722-.047.18.061.176.13.131.055-.035 1.74-1.127 2.457-1.602C9.642 17.848 10.796 18 12 18c5.523 0 10-3.477 10-7.767C22 6.477 17.523 3 12 3z"/></svg>
        </a>

        {/* Copy Link */}
        <button 
          onClick={handleCopy}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition shadow-sm ${
            copied ? 'bg-violet-500 text-white' : 'bg-[#6B7280] text-white'
          }`}
        >
          {copied ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
