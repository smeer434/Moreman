import React, { useState } from 'react';
import { Logo } from './Logo';
import { useWallet } from '../context/WalletContext';
import { Wallet, Bell, ExternalLink, LogOut, Check, Copy, ChevronDown, Layers } from 'lucide-react';
import { getExplorerAccountUrl } from '../services/aptos';

interface TopNavBarProps {
  activeTab: 'home' | 'marketplace' | 'my-data' | 'docs';
  setActiveTab: (tab: 'home' | 'marketplace' | 'my-data' | 'docs') => void;
  onOpenListModal: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenListModal,
}) => {
  const { isConnected, isConnecting, address, formattedAddress, balance, connectWallet, disconnectWallet } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav 
      id="moreman-top-navbar"
      className="sticky top-0 z-50 w-full border-b border-[#85d6b8]/20 bg-[#101412]/90 backdrop-blur-md shadow-[0_0_20px_rgba(133,214,184,0.08)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8 md:gap-12">
          <div onClick={() => setActiveTab('home')}>
            <Logo size="md" showText={true} />
          </div>

          {/* Nav items desktop */}
          <div className="hidden md:flex items-center gap-8 h-full pt-1">
            <button
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`font-sans text-sm font-semibold transition-all py-2 border-b-2 ${
                activeTab === 'home'
                  ? 'text-[#85d6b8] border-[#85d6b8]'
                  : 'text-[#bec9c3] border-transparent hover:text-[#85d6b8]'
              }`}
            >
              Home
            </button>

            <button
              id="nav-marketplace"
              onClick={() => setActiveTab('marketplace')}
              className={`font-sans text-sm font-semibold transition-all py-2 border-b-2 ${
                activeTab === 'marketplace'
                  ? 'text-[#85d6b8] border-[#85d6b8]'
                  : 'text-[#bec9c3] border-transparent hover:text-[#85d6b8]'
              }`}
            >
              Marketplace
            </button>

            <button
              id="nav-my-data"
              onClick={() => setActiveTab('my-data')}
              className={`font-sans text-sm font-semibold transition-all py-2 border-b-2 ${
                activeTab === 'my-data'
                  ? 'text-[#85d6b8] border-[#85d6b8]'
                  : 'text-[#bec9c3] border-transparent hover:text-[#85d6b8]'
              }`}
            >
              My Data
            </button>

            <button
              id="nav-docs"
              onClick={() => setActiveTab('docs')}
              className={`font-sans text-sm font-semibold transition-all py-2 border-b-2 ${
                activeTab === 'docs'
                  ? 'text-[#85d6b8] border-[#85d6b8]'
                  : 'text-[#bec9c3] border-transparent hover:text-[#85d6b8]'
              }`}
            >
              Docs
            </button>
          </div>
        </div>

        {/* Right: Wallet & Quick Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Quick List Action Button */}
          <button
            id="quick-list-btn"
            onClick={onOpenListModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#002b20] border border-[#85d6b8]/40 text-[#85d6b8] text-xs font-semibold hover:bg-[#85d6b8]/10 hover:border-[#85d6b8] transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>List Dataset</span>
          </button>

          {/* Notification Icon */}
          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-[#85d6b8]/20 bg-[#181d1a] text-[#bec9c3] hover:text-[#85d6b8] hover:border-[#85d6b8]/50 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
          </div>

          {/* Wallet Connection */}
          {isConnected && address ? (
            <div className="relative">
              <button
                id="wallet-user-badge"
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2.5 bg-[#1c211e] border border-[#85d6b8]/40 hover:border-[#85d6b8] px-3.5 py-2 rounded-lg text-xs font-mono text-[#85d6b8] shadow-[0_0_12px_rgba(133,214,184,0.15)] transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#73e6cb] animate-pulse" />
                <span className="font-bold">{formattedAddress}</span>
                <span className="text-[#bec9c3] font-normal border-l border-[#85d6b8]/30 pl-2">
                  {balance.toFixed(2)} APT
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#bec9c3]" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div 
                  id="wallet-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-lg bg-[#181d1a] border border-[#85d6b8]/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="mb-2 pb-2 border-b border-[#85d6b8]/15">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#88938d]">Connected Network</div>
                    <div className="text-xs font-semibold text-[#85d6b8] flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#73e6cb]"></span>
                      Aptos Shelbynet / Testnet
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#88938d]">Wallet Address</div>
                    <div className="text-xs font-mono text-[#e0e3e0] truncate mt-0.5">{address}</div>
                    <div className="text-xs font-mono text-[#85d6b8] mt-1 font-semibold">
                      Balance: {balance.toFixed(4)} APT
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-medium">
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#101412] hover:bg-[#85d6b8]/10 text-[#bec9c3] hover:text-[#85d6b8] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {copied ? <Check className="w-3.5 h-3.5 text-[#73e6cb]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied to Clipboard' : 'Copy Address'}
                      </span>
                    </button>

                    <a
                      href={getExplorerAccountUrl(address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#101412] hover:bg-[#85d6b8]/10 text-[#bec9c3] hover:text-[#85d6b8] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View on Aptos Explorer
                      </span>
                    </a>

                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowWalletMenu(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#93000a]/20 text-[#ffb4ab] hover:bg-[#93000a]/30 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="connect-wallet-btn"
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-sans font-bold px-5 py-2 rounded-lg text-sm transition-all glow-hover flex items-center gap-2 shadow-[0_0_15px_rgba(133,214,184,0.3)] disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="flex md:hidden border-t border-[#85d6b8]/15 px-4 py-2 justify-around bg-[#101412]/95 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2.5 rounded ${activeTab === 'home' ? 'text-[#85d6b8] bg-[#85d6b8]/10' : 'text-[#bec9c3]'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-1 px-2.5 rounded ${activeTab === 'marketplace' ? 'text-[#85d6b8] bg-[#85d6b8]/10' : 'text-[#bec9c3]'}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('my-data')}
          className={`py-1 px-2.5 rounded ${activeTab === 'my-data' ? 'text-[#85d6b8] bg-[#85d6b8]/10' : 'text-[#bec9c3]'}`}
        >
          My Data
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`py-1 px-2.5 rounded ${activeTab === 'docs' ? 'text-[#85d6b8] bg-[#85d6b8]/10' : 'text-[#bec9c3]'}`}
        >
          Docs
        </button>
      </div>
    </nav>
  );
};
