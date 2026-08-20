import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useWallet } from '../context/WalletContext';
import { Dataset, DatasetCategory } from '../types';
import { AnimatedRadar } from './AnimatedRadar';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Satellite, 
  Radio, 
  Cpu, 
  HeartPulse, 
  Globe, 
  Sparkles,
  Layers,
  Activity,
  Zap,
  Inbox
} from 'lucide-react';
import { formatAddress } from '../services/aptos';

interface MarketplaceViewProps {
  onSelectDatasetToQuery: (dataset: Dataset) => void;
  onOpenListModal: () => void;
  onNavigateToMyData: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onSelectDatasetToQuery,
  onOpenListModal,
  onNavigateToMyData,
}) => {
  const { 
    filteredDatasets, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    liveEvents,
    currentReadRate,
    totalRevenue24h,
    datasets
  } = useMarketplace();

  const { address } = useWallet();

  const userDatasetCount = datasets.filter(d => 
    !d.isDelisted && address && d.owner.toLowerCase() === address.toLowerCase()
  ).length;

  const categories: { label: string; value: DatasetCategory | null; icon: any }[] = [
    { label: 'All Datasets', value: null, icon: Layers },
    { label: 'Finance', value: 'Finance', icon: TrendingUp },
    { label: 'Satellite', value: 'Satellite', icon: Satellite },
    { label: 'IoT', value: 'IoT', icon: Radio },
    { label: 'AI Models', value: 'AI Models', icon: Cpu },
    { label: 'Healthcare', value: 'Healthcare', icon: HeartPulse },
    { label: 'Climate', value: 'Climate', icon: Globe },
  ];

  const getCategoryBadge = (category: DatasetCategory) => {
    switch (category) {
      case 'Finance':
        return {
          color: 'bg-[#85d6b8]/10 text-[#85d6b8] border-[#85d6b8]/20',
          icon: TrendingUp,
        };
      case 'Satellite':
        return {
          color: 'bg-[#63dbbc]/10 text-[#63dbbc] border-[#63dbbc]/20',
          icon: Satellite,
        };
      case 'IoT':
        return {
          color: 'bg-[#ffdbcc]/10 text-[#ffb594] border-[#ffdbcc]/20',
          icon: Radio,
        };
      case 'AI Models':
        return {
          color: 'bg-[#85d6b8]/15 text-[#a1f3d3] border-[#85d6b8]/30',
          icon: Cpu,
        };
      case 'Healthcare':
        return {
          color: 'bg-[#63dbbc]/15 text-[#63dbbc] border-[#63dbbc]/30',
          icon: HeartPulse,
        };
      case 'Climate':
        return {
          color: 'bg-[#ffdbcc]/15 text-[#ffb594] border-[#ffdbcc]/30',
          icon: Globe,
        };
      default:
        return {
          color: 'bg-[#85d6b8]/10 text-[#85d6b8] border-[#85d6b8]/20',
          icon: Sparkles,
        };
    }
  };

  const formatTotalReads = (reads: number) => {
    if (reads >= 1000) {
      return `${(reads / 1000).toFixed(1)}k`;
    }
    return reads.toString();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content: Data Hub & Grid */}
        <main className="flex-1 w-full min-w-0">
          {/* Header Bar */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#e0e3e0] font-sans">
                Data Hub
              </h1>
              <p className="text-xs md:text-sm text-[#bec9c3] mt-2 font-mono uppercase tracking-wider">
                EXPLORE DECENTRALIZED ON-CHAIN DATASETS
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#bec9c3]" />
              <input
                id="search-datasets-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search datasets..."
                className="w-full bg-[#181d1a] border border-[#3f4944] focus:border-[#85d6b8] focus:ring-1 focus:ring-[#85d6b8] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-[#e0e3e0] placeholder-[#88938d] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#85d6b8] text-[#003829] font-bold shadow-[0_0_12px_rgba(133,214,184,0.25)]'
                      : 'bg-[#181d1a] border border-[#85d6b8]/20 text-[#bec9c3] hover:text-[#e0e3e0] hover:border-[#85d6b8]/50'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Datasets Grid or Genuine Empty State */}
          {filteredDatasets.length === 0 ? (
            <div className="bg-[#181d1a] tech-border rounded-lg p-12 text-center my-8 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-[#00513e]/20 border border-[#85d6b8]/40 flex items-center justify-center text-[#85d6b8] mx-auto mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#e0e3e0] mb-2 font-sans">
                {searchQuery || selectedCategory ? 'No Matching Datasets' : 'No Datasets Listed Yet'}
              </h3>
              <p className="text-xs font-mono text-[#bec9c3] max-w-md mx-auto mb-6 leading-relaxed">
                {searchQuery || selectedCategory
                  ? 'No on-chain datasets match your current search query or category filter.'
                  : 'Be the first to list a proprietary AI model, financial stream, or dataset on Shelby Protocol and earn APT on every query.'}
              </p>
              
              {searchQuery || selectedCategory ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#101412] border border-[#85d6b8]/40 text-[#85d6b8] text-xs font-mono hover:bg-[#85d6b8]/10"
                >
                  Clear Search Filters
                </button>
              ) : (
                <button
                  onClick={onOpenListModal}
                  className="px-6 py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold text-xs glow-hover transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>List First Dataset</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset) => {
                const badge = getCategoryBadge(dataset.category);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={dataset.id}
                    id={`dataset-card-${dataset.num || dataset.id}`}
                    className="bg-[#181d1a] tech-border p-6 rounded-lg relative flex flex-col justify-between group h-full shadow-lg"
                  >
                    {/* Top Right Card Number */}
                    <span className="absolute top-4 right-4 font-mono text-sm text-[#85d6b8]/50 group-hover:text-[#85d6b8] transition-colors">
                      {dataset.num}
                    </span>

                    <div>
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${badge.color}`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{dataset.category}</span>
                        </span>
                      </div>

                      {/* Dataset Title */}
                      <h3 className="text-xl font-bold text-[#e0e3e0] font-sans mb-3 group-hover:text-[#85d6b8] transition-colors line-clamp-1">
                        {dataset.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#bec9c3] leading-relaxed mb-6 line-clamp-3">
                        {dataset.description}
                      </p>
                    </div>

                    <div>
                      {/* Owner & Reads Metadata Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs border-t border-[#3f4944]/30 pt-4">
                        <div>
                          <div className="text-[10px] text-[#88938d] uppercase tracking-wider">OWNER</div>
                          <div className="text-[#e0e3e0] font-medium truncate mt-0.5" title={dataset.owner}>
                            {formatAddress(dataset.owner, 3)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-[#88938d] uppercase tracking-wider">TOTAL READS</div>
                          <div className="text-[#e0e3e0] font-bold mt-0.5">
                            {formatTotalReads(dataset.totalReads)}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Bar: Price & Query Button */}
                      <div className="flex items-center justify-between border-t border-[#3f4944]/30 pt-4 mt-auto">
                        <div className="font-mono text-xs">
                          <span className="text-[#85d6b8] font-bold text-sm">
                            {dataset.pricePerReadApt} APT
                          </span>
                          <span className="text-[#88938d]"> / read</span>
                        </div>

                        <button
                          id={`query-data-btn-${dataset.id}`}
                          onClick={() => onSelectDatasetToQuery(dataset)}
                          className="bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-sans font-bold text-xs px-4 py-2 rounded glow-hover shadow-[0_0_12px_rgba(133,214,184,0.25)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Query Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Right Side Panel: Live Activity Stream & Provisioning */}
        <aside className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6">
          {/* Live Activity Detail Panel */}
          <div className="glass-panel tech-border rounded-lg p-6 sticky top-28 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-[#3f4944]/30 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#85d6b8] font-sans">
                  Live Activity
                </h2>
                <span className="font-mono text-[11px] text-[#bec9c3] mt-0.5 block">
                  NETWORK: Shelbynet Aptos
                </span>
              </div>

              {/* Pulsing Sensors Icon */}
              <div className="h-9 w-9 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#85d6b8]/20 rounded-full animate-ping" />
                <div className="w-7 h-7 rounded-full bg-[#00513e]/60 border border-[#85d6b8] flex items-center justify-center text-[#73e6cb]">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Screen Component Viewport (Radar Animation) */}
            <div className="bg-[#0b0f0d] border border-[#3f4944] rounded p-1 mb-6 relative overflow-hidden h-40">
              <AnimatedRadar />
            </div>

            {/* Metrics & Stream Feed */}
            <div className="space-y-4">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#88938d] uppercase tracking-wider">CURRENT READ RATE</span>
                <span className="text-[#73e6cb] font-bold text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {currentReadRate} req/sec
                </span>
              </div>

              {/* Real Stream Payload Box */}
              <div className="bg-[#101412] p-3 rounded border border-[#3f4944]/50 font-mono text-[11px] text-[#bec9c3] overflow-x-auto shadow-inner">
                <div className="text-[10px] text-[#88938d] mb-1 flex items-center justify-between">
                  <span>SHELBY STREAM FEED</span>
                  <span className="text-[#73e6cb] animate-pulse">● LIVE</span>
                </div>
                {liveEvents.length > 0 ? (
                  <pre className="text-[#85d6b8] leading-tight">
{JSON.stringify(liveEvents[0], null, 2)}
                  </pre>
                ) : (
                  <div className="text-center py-4 text-[#88938d] text-[11px]">
                    No live stream queries recorded yet
                  </div>
                )}
              </div>

              {/* Total Revenue 24h Box */}
              <div className="pt-4 border-t border-[#3f4944]/30 flex justify-between items-center">
                <div>
                  <div className="font-mono text-[10px] text-[#88938d] uppercase tracking-wider">
                    TOTAL REVENUE (24H)
                  </div>
                  <div className="text-2xl font-bold text-[#85d6b8] font-mono mt-0.5">
                    {totalRevenue24h.toFixed(2)} <span className="text-xs font-normal text-[#bec9c3]">APT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual 'My Data Provisioning' Teaser Panel */}
          <div className="bg-[#181d1a] tech-border rounded-lg p-6 shadow-md">
            <h3 className="font-bold text-sm text-[#e0e3e0] mb-1.5 flex items-center gap-2 font-sans">
              <Layers className="w-4 h-4 text-[#85d6b8]" />
              <span>My Data Provisioning</span>
            </h3>
            <p className="text-xs text-[#bec9c3] mb-4 leading-relaxed font-mono">
              {userDatasetCount > 0 
                ? `You have ${userDatasetCount} dataset${userDatasetCount > 1 ? 's' : ''} actively streaming on-chain.`
                : 'Monetize your proprietary models and datasets with continuous micro-reads.'}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                id="sidebar-list-dataset-btn"
                onClick={onOpenListModal}
                className="w-full border border-[#85d6b8] text-[#85d6b8] hover:bg-[#85d6b8]/15 font-bold text-xs px-4 py-2.5 rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>List New Dataset</span>
              </button>

              <button
                onClick={onNavigateToMyData}
                className="w-full bg-[#101412] hover:bg-[#181d1a] text-[#bec9c3] hover:text-[#e0e3e0] text-xs font-mono py-2 rounded transition-colors text-center cursor-pointer"
              >
                View My Listed Datasets &amp; Reads &rarr;
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
