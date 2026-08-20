import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { TopNavBar } from './components/TopNavBar';
import { HeroSection } from './components/HeroSection';
import { MarketplaceView } from './components/MarketplaceView';
import { MyDataView } from './components/MyDataView';
import { Footer } from './components/Footer';
import { QueryDataModal } from './components/QueryDataModal';
import { ListDatasetModal } from './components/ListDatasetModal';
import { DelistDatasetModal } from './components/DelistDatasetModal';
import { DocsModal } from './components/DocsModal';
import { RetrievedDataModal } from './components/RetrievedDataModal';
import { Dataset, PaidReadRecord } from './types';

function MoremanApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'marketplace' | 'my-data' | 'docs'>('home');
  
  // Modals state
  const [queryDataset, setQueryDataset] = useState<Dataset | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [delistDataset, setDelistDataset] = useState<Dataset | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [inspectRecord, setInspectRecord] = useState<PaidReadRecord | null>(null);

  const handleTabChange = (tab: 'home' | 'marketplace' | 'my-data' | 'docs') => {
    if (tab === 'docs') {
      setIsDocsModalOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101412] text-[#e0e3e0] bg-tech-grid font-sans selection:bg-[#85d6b8]/30 selection:text-[#a1f3d3]">
      {/* Sticky Top Nav */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenListModal={() => setIsListModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1 w-full">
        {activeTab === 'home' && (
          <HeroSection
            onBrowseMarketplace={() => handleTabChange('marketplace')}
            onOpenDocs={() => setIsDocsModalOpen(true)}
            onOpenListModal={() => setIsListModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            onSelectDatasetToQuery={(ds) => setQueryDataset(ds)}
            onOpenListModal={() => setIsListModalOpen(true)}
            onNavigateToMyData={() => handleTabChange('my-data')}
          />
        )}

        {activeTab === 'my-data' && (
          <MyDataView
            onOpenListModal={() => setIsListModalOpen(true)}
            onOpenDelistModal={(ds) => setDelistDataset(ds)}
            onViewRetrievedData={(record) => setInspectRecord(record)}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer setActiveTab={handleTabChange} />

      {/* MODALS */}
      {queryDataset && (
        <QueryDataModal
          dataset={queryDataset}
          onClose={() => setQueryDataset(null)}
        />
      )}

      {isListModalOpen && (
        <ListDatasetModal
          onClose={() => setIsListModalOpen(false)}
          onSuccess={() => {
            // Can switch to marketplace or my-data to see new dataset
            handleTabChange('my-data');
          }}
        />
      )}

      {delistDataset && (
        <DelistDatasetModal
          dataset={delistDataset}
          onClose={() => setDelistDataset(null)}
          onSuccess={() => {
            setDelistDataset(null);
          }}
        />
      )}

      {isDocsModalOpen && (
        <DocsModal onClose={() => setIsDocsModalOpen(false)} />
      )}

      {inspectRecord && (
        <RetrievedDataModal
          record={inspectRecord}
          onClose={() => setInspectRecord(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <MarketplaceProvider>
        <MoremanApp />
      </MarketplaceProvider>
    </WalletProvider>
  );
}

