import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Lock, Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'marketplace' | 'my-data' | 'docs') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer 
      id="moreman-global-footer"
      className="w-full border-t border-[#85d6b8]/20 bg-[#080d0b] text-[#bec9c3] pt-14 pb-10 mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Upper Row: Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#3f4944]/30">
          {/* Logo & Brand Wordmark */}
          <div onClick={() => setActiveTab('home')}>
            <Logo size="md" showText={true} />
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 font-sans text-sm font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-[#85d6b8] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="hover:text-[#85d6b8] transition-colors"
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('my-data')}
              className="hover:text-[#85d6b8] transition-colors"
            >
              My Data
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-[#85d6b8] transition-colors"
            >
              Docs
            </button>
          </div>
        </div>

        {/* Middle Row: Creator Credit & Disclaimer Box */}
        <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#3f4944]/30">
          {/* Built by Smeer with GitHub icon */}
          <div className="flex items-center gap-3">
            <a
              id="github-creator-link"
              href="https://github.com/smeer434"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#181d1a] border border-[#85d6b8]/30 hover:border-[#85d6b8] text-[#e0e3e0] hover:text-[#85d6b8] transition-all font-mono text-xs shadow-sm group"
            >
              <Github className="w-4 h-4 text-[#85d6b8] group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Built by Smeer</span>
              <ExternalLink className="w-3 h-3 text-[#88938d]" />
            </a>
          </div>

          {/* Unofficial Disclaimer Notice (Varying wording from homepage) */}
          <p className="text-xs text-[#88938d] max-w-xl md:text-right font-mono leading-relaxed">
            Moreman is an independent, unofficial application built on Shelby Protocol and is not affiliated with or endorsed by the Shelby team.
          </p>
        </div>

        {/* Bottom Row: Copyright & Security Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#88938d]">
          <div>
            &copy; 2024 MOREMAN PROTOCOL. ALL DATASETS ENCRYPTED.
          </div>

          <div className="flex items-center gap-4 text-[#73e6cb]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aptos Testnet Verified</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-GCM-256 Storage Streams</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
