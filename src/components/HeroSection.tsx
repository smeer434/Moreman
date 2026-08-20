import React from 'react';
import { Database, Search, Coins, ArrowRight, ShieldCheck, Zap, Server, Cpu, ExternalLink, Activity } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface HeroSectionProps {
  onBrowseMarketplace: () => void;
  onOpenDocs: () => void;
  onOpenListModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseMarketplace,
  onOpenDocs,
  onOpenListModal,
}) => {
  const { currentReadRate, datasets } = useMarketplace();

  return (
    <div className="flex flex-col gap-20 max-w-[1440px] mx-auto px-4 md:px-12 py-12">
      {/* Hero Header Area */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-6 pb-4">
        {/* Network Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181d1a] border border-[#85d6b8]/40 text-[#73e6cb] text-xs font-mono tracking-wider uppercase mb-8 shadow-[0_0_15px_rgba(115,230,203,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#73e6cb] animate-ping" />
          <span>Network Status Active Shelbynet</span>
        </div>

        {/* Hero Headline - Clean without punctuation */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#e0e3e0] leading-[1.12] mb-6">
          Access real AI training data <br className="hidden sm:inline" />
          <span className="text-[#85d6b8] glow-text-primary">with sub-second latency</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-[#bec9c3] max-w-2xl leading-relaxed mb-10">
          Pay only for what you query with pay-per-read pricing and on-chain payment proof via Shelby Protocol
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
          <button
            id="hero-browse-datasets-btn"
            onClick={onBrowseMarketplace}
            className="flex-1 sm:flex-none px-7 py-3.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-sans font-bold text-sm sm:text-base glow-hover shadow-[0_0_20px_rgba(133,214,184,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span>Browse Datasets</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-documentation-btn"
            onClick={onOpenDocs}
            className="flex-1 sm:flex-none px-7 py-3.5 rounded-lg bg-transparent border border-[#85d6b8]/60 hover:border-[#85d6b8] hover:bg-[#85d6b8]/10 text-[#e0e3e0] font-sans font-semibold text-sm sm:text-base transition-all"
          >
            Documentation
          </button>
        </div>

        {/* Protocol Metric Quick Bar */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 pt-8 border-t border-[#85d6b8]/15 w-full max-w-3xl text-left font-mono">
          <div className="bg-[#181d1a]/60 border border-[#85d6b8]/15 rounded-lg p-3 sm:p-4">
            <div className="text-[11px] text-[#88938d] uppercase tracking-wider">Active Streams</div>
            <div className="text-lg sm:text-2xl font-bold text-[#85d6b8] mt-1">{datasets.length} Datasets</div>
          </div>
          <div className="bg-[#181d1a]/60 border border-[#85d6b8]/15 rounded-lg p-3 sm:p-4">
            <div className="text-[11px] text-[#88938d] uppercase tracking-wider">Query Throughput</div>
            <div className="text-lg sm:text-2xl font-bold text-[#73e6cb] mt-1">{currentReadRate} req/sec</div>
          </div>
          <div className="bg-[#181d1a]/60 border border-[#85d6b8]/15 rounded-lg p-3 sm:p-4">
            <div className="text-[11px] text-[#88938d] uppercase tracking-wider">Settlement Latency</div>
            <div className="text-lg sm:text-2xl font-bold text-[#e0e3e0] mt-1">&lt; 180ms</div>
          </div>
        </div>
      </section>

      {/* PROTOCOL OPERATION Section */}
      <section className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-mono uppercase tracking-[0.2em] font-bold text-[#e0e3e0]">
            Protocol Operation
          </h2>
          <div className="w-16 h-0.5 bg-[#85d6b8]/60 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 01 */}
          <div 
            id="protocol-step-01"
            className="bg-[#181d1a] tech-border p-8 rounded-lg relative flex flex-col justify-between group h-full"
          >
            <span className="absolute top-6 right-6 font-mono text-2xl sm:text-3xl font-bold text-[#85d6b8]/30 group-hover:text-[#85d6b8] transition-colors">
              01
            </span>

            <div>
              <div className="w-12 h-12 rounded-lg bg-[#00513e]/40 border border-[#85d6b8]/30 flex items-center justify-center text-[#85d6b8] mb-6">
                <Database className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-[#e0e3e0] mb-3">
                List a Dataset
              </h3>

              <p className="text-sm text-[#bec9c3] leading-relaxed">
                Owners set price per read. Cryptographically secure your dataset streams on the decentralized network.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#85d6b8]/15 font-mono text-xs text-[#85d6b8]/80 flex items-center gap-1.5">
              <span>Shelby Blob Storage</span>
            </div>
          </div>

          {/* Card 02 */}
          <div 
            id="protocol-step-02"
            className="bg-[#181d1a] tech-border p-8 rounded-lg relative flex flex-col justify-between group h-full"
          >
            <span className="absolute top-6 right-6 font-mono text-2xl sm:text-3xl font-bold text-[#85d6b8]/30 group-hover:text-[#85d6b8] transition-colors">
              02
            </span>

            <div>
              <div className="w-12 h-12 rounded-lg bg-[#00513e]/40 border border-[#85d6b8]/30 flex items-center justify-center text-[#85d6b8] mb-6">
                <Search className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-[#e0e3e0] mb-3">
                Query It
              </h3>

              <p className="text-sm text-[#bec9c3] leading-relaxed">
                Buyers pay per read in real time. Access data streams instantly without complex subscription models.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#85d6b8]/15 font-mono text-xs text-[#85d6b8]/80 flex items-center gap-1.5">
              <span>Sub-second Read Latency</span>
            </div>
          </div>

          {/* Card 03 */}
          <div 
            id="protocol-step-03"
            className="bg-[#181d1a] tech-border p-8 rounded-lg relative flex flex-col justify-between group h-full"
          >
            <span className="absolute top-6 right-6 font-mono text-2xl sm:text-3xl font-bold text-[#85d6b8]/30 group-hover:text-[#85d6b8] transition-colors">
              03
            </span>

            <div>
              <div className="w-12 h-12 rounded-lg bg-[#00513e]/40 border border-[#85d6b8]/30 flex items-center justify-center text-[#85d6b8] mb-6">
                <Coins className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-[#e0e3e0] mb-3">
                Get Paid Instantly
              </h3>

              <p className="text-sm text-[#bec9c3] leading-relaxed">
                Real APT sent to owners per read. Automated on-chain settlement ensures immediate liquidity.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#85d6b8]/15 font-mono text-xs text-[#85d6b8]/80 flex items-center gap-1.5">
              <span>Direct Wallet-to-Wallet</span>
            </div>
          </div>
        </div>
      </section>

      {/* For Data Owners & AI Developers Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[#181d1a]/80 tech-border rounded-xl p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#85d6b8] bg-[#00513e]/30 px-3 py-1 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>For Dataset Creators &amp; Providers</span>
            </div>
            <h3 className="text-2xl font-bold text-[#e0e3e0] mb-4">
              Continuous micro-monetization without lock-in
            </h3>
            <p className="text-sm text-[#bec9c3] leading-relaxed mb-6">
              Forget rigid monthly SaaS plans. List your AI training data chunks, satellite feeds, or specialized models on Shelby Protocol and receive instant Aptos token settlement each time an AI agent, researcher, or pipeline triggers a read.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#bec9c3]">
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#73e6cb]" />
                <span>Encrypted storage blobs with zero raw file piracy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-[#73e6cb]" />
                <span>Instant revenue directly to your Petra / Aptos wallet in Octas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#73e6cb]" />
                <span>Granular query telemetry and real-time read counter</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#85d6b8]/15">
            <button
              onClick={onOpenListModal}
              className="w-full py-3 rounded-lg bg-[#002b20] border border-[#85d6b8] text-[#85d6b8] font-bold text-sm hover:bg-[#85d6b8]/15 transition-all flex items-center justify-center gap-2"
            >
              <span>List Your First Dataset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-[#181d1a]/80 tech-border rounded-xl p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#73e6cb] bg-[#00513e]/30 px-3 py-1 rounded-full mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>For AI Engineers &amp; Autonomous Agents</span>
            </div>
            <h3 className="text-2xl font-bold text-[#e0e3e0] mb-4">
              Query level access tailored for machine intelligence
            </h3>
            <p className="text-sm text-[#bec9c3] leading-relaxed mb-6">
              AI models require dynamic, high-entropy training data on demand. Moreman allows programmatic retrieval via Shelby client with micro-payment proofs validated directly on Aptos blockchain nodes.
            </p>

            <ul className="space-y-3 font-mono text-xs text-[#bec9c3]">
              <li className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-[#73e6cb]" />
                <span>Sub-200ms read latency with Shelby high-frequency streams</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#73e6cb]" />
                <span>On-chain cryptographic receipt verified via Aptos explorer</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#73e6cb]" />
                <span>Pure cryptographic wallet authentication without credit cards</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#85d6b8]/15">
            <button
              onClick={onBrowseMarketplace}
              className="w-full py-3 rounded-lg bg-[#85d6b8] text-[#003829] font-bold text-sm hover:bg-[#a1f3d3] glow-hover transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Marketplace Data Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <section 
        id="homepage-notice-box"
        className="rounded-lg p-6 bg-[#002018] border border-[#85d6b8]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#bec9c3]"
      >
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#73e6cb] mt-1.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-[#85d6b8]">Protocol Notice:</strong> Moreman is an independent, decentralized AI dataset marketplace protocol leveraging Shelby Protocol high-frequency stream readers and Aptos on-chain settlement. It is not affiliated with or endorsed by the Shelby core foundation.
          </p>
        </div>
        <button
          onClick={onOpenDocs}
          className="text-[#85d6b8] hover:text-[#a1f3d3] whitespace-nowrap font-bold flex items-center gap-1.5"
        >
          <span>Read Specs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
