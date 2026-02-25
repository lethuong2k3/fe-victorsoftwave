import React, { useState } from 'react';
import { MessageCircle, MessagesSquare, X, MessageSquareText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';

interface HomeContent {
  zaloUrl?: string;
  messengerUrl?: string;
  adminChatUrl?: string;
}

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch home content to get links
  const { data } = useQuery({
    queryKey: ['home-content'],
    queryFn: () => api.get<HomeContent>('/api/pages/home'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!data) return null;

  const { zaloUrl, messengerUrl, adminChatUrl } = data;

  // If no links configured, don't show
  if (!zaloUrl && !messengerUrl && !adminChatUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Menu */}
      <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
        
        {/* Zalo */}
        {zaloUrl && (
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center justify-center w-12 h-12 bg-[#0068FF] text-white rounded-full shadow-lg hover:bg-[#0054cc] transition-colors group relative"
          >
            <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Zalo
            </span>
            <span className="font-bold text-2xl font-sans leading-none pb-1">Z</span>
          </a>
        )}

        {/* Messenger */}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center justify-center w-12 h-12 bg-[#0084FF] text-white rounded-full shadow-lg hover:bg-[#0078e0] transition-colors group relative"
          >
             <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Messenger
            </span>
            <MessageCircle size={24} />
          </a>
        )}

        {/* Chat Admin */}
        {adminChatUrl && (
          <a
            href={adminChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors group relative"
          >
             <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat Admin
            </span>
            <MessagesSquare size={24} />
          </a>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 relative"
      >
        <div className={`absolute transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
          <MessageSquareText size={28} />
        </div>
        <div className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
           <X size={28} />
        </div>
        
        {/* Pulse effect if closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-ping"></span>
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
