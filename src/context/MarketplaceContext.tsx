import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dataset, PaidReadRecord, LiveActivityEvent } from '../types';
import { INITIAL_DATASETS } from '../data/initialDatasets';
import { shelbyService } from '../services/shelby';

interface MarketplaceContextType {
  datasets: Dataset[];
  paidHistory: PaidReadRecord[];
  liveEvents: LiveActivityEvent[];
  currentReadRate: number;
  totalRevenue24h: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  filteredDatasets: Dataset[];
  executePaidRead: (
    dataset: Dataset, 
    buyerAddress: string, 
    txnHash: string
  ) => Promise<{ sampleData: any; proofHash: string; latencyMs: number }>;
  registerNewDataset: (
    newDataset: Omit<Dataset, 'id' | 'num' | 'totalReads' | 'createdAt' | 'shelbyBlobId'>,
    fileContent: string | object,
    txnHash: string
  ) => Promise<Dataset>;
  delistDataset: (datasetId: string, txnHash: string) => Promise<void>;
  getDatasetById: (id: string) => Dataset | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const DATASETS_STORAGE_KEY = 'moreman_datasets_v3';
const HISTORY_STORAGE_KEY = 'moreman_history_v3';
const LIVE_EVENTS_STORAGE_KEY = 'moreman_live_events_v3';

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>(() => {
    try {
      const saved = localStorage.getItem(DATASETS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved datasets:', e);
    }
    return INITIAL_DATASETS;
  });

  const [paidHistory, setPaidHistory] = useState<PaidReadRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved history:', e);
    }
    return [];
  });

  const [liveEvents, setLiveEvents] = useState<LiveActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(LIVE_EVENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved live events:', e);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Persist datasets, history, & live events
  useEffect(() => {
    try {
      localStorage.setItem(DATASETS_STORAGE_KEY, JSON.stringify(datasets));
    } catch (e) {}
  }, [datasets]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(paidHistory));
    } catch (e) {}
  }, [paidHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(LIVE_EVENTS_STORAGE_KEY, JSON.stringify(liveEvents));
    } catch (e) {}
  }, [liveEvents]);

  // Calculate real 24h revenue from real on-chain paid reads
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const totalRevenue24h = paidHistory
    .filter(item => item.timestamp >= oneDayAgo)
    .reduce((sum, item) => sum + (item.priceApt || 0), 0);

  // Calculate real current read rate based on recent reads (or 0 when idle)
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const recentReads = paidHistory.filter(item => item.timestamp >= fiveMinutesAgo);
  const currentReadRate = recentReads.length > 0 ? +(recentReads.length / 300).toFixed(2) : 0;

  const filteredDatasets = datasets.filter(ds => {
    if (ds.isDelisted) return false;
    const matchesSearch = 
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = !selectedCategory || ds.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getDatasetById = (id: string) => datasets.find(d => d.id === id);

  /**
   * Completes a paid read on Shelby:
   * 1. Fetches decrypted chunk via Shelby Storage Service
   * 2. Increments read counter on dataset
   * 3. Stores in paid history
   * 4. Pushes real event to live activity stream
   */
  const executePaidRead = async (
    dataset: Dataset, 
    buyerAddress: string, 
    txnHash: string
  ): Promise<{ sampleData: any; proofHash: string; latencyMs: number }> => {
    // 1. Fetch Shelby read
    const shelbyResult = await shelbyService.readPaidStream(
      dataset.shelbyBlobId,
      txnHash,
      dataset.sampleData
    );

    // 2. Increment read counter on dataset
    setDatasets(prev => 
      prev.map(d => {
        if (d.id === dataset.id) {
          return {
            ...d,
            totalReads: d.totalReads + 1,
          };
        }
        return d;
      })
    );

    // 3. Add to buyer's paid history
    const historyItem: PaidReadRecord = {
      id: `read_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      datasetId: dataset.id,
      datasetName: dataset.name,
      ownerAddress: dataset.owner,
      buyerAddress,
      priceApt: dataset.pricePerReadApt,
      txnHash,
      timestamp: Date.now(),
      status: 'CONFIRMED',
      dataSnippet: shelbyResult.data,
      shelbyStreamId: dataset.shelbyBlobId,
    };
    setPaidHistory(prev => [historyItem, ...prev]);

    // 4. Add real verified event to live activity
    const liveEvt: LiveActivityEvent = {
      id: `evt-${Date.now()}`,
      dataset: dataset.name.replace(/\s+/g, '_').slice(0, 16),
      req_id: `req_${txnHash.slice(2, 8)}`,
      status: 'AUTHORIZED',
      fee_paid: `${dataset.pricePerReadApt}_APT`,
      timestamp: Math.floor(Date.now() / 1000),
      buyer: `${buyerAddress.slice(0, 6)}...${buyerAddress.slice(-4)}`,
      txnHash,
    };
    setLiveEvents(prev => [liveEvt, ...prev.slice(0, 19)]);

    return {
      sampleData: shelbyResult.data,
      proofHash: shelbyResult.proofHash,
      latencyMs: shelbyResult.latencyMs,
    };
  };

  /**
   * Register new dataset on Shelby and Aptos
   */
  const registerNewDataset = async (
    newDatasetData: Omit<Dataset, 'id' | 'num' | 'totalReads' | 'createdAt' | 'shelbyBlobId'>,
    fileContent: string | object,
    txnHash: string
  ): Promise<Dataset> => {
    // Upload blob to Shelby Protocol
    const blobMeta = await shelbyService.uploadDatasetBlob(
      newDatasetData.name,
      fileContent,
      'application/json'
    );

    const nextIndex = (datasets.length + 1).toString().padStart(2, '0');
    const createdDataset: Dataset = {
      ...newDatasetData,
      id: `ds_${Date.now()}`,
      num: nextIndex,
      totalReads: 0,
      shelbyBlobId: blobMeta.blobId,
      createdAt: Date.now(),
      isCustom: true,
    };

    setDatasets(prev => [createdDataset, ...prev]);

    // Register event in live feed
    const liveEvt: LiveActivityEvent = {
      id: `evt-list-${Date.now()}`,
      dataset: newDatasetData.name.replace(/\s+/g, '_').slice(0, 16),
      req_id: `list_${txnHash.slice(2, 8)}`,
      status: 'AUTHORIZED',
      fee_paid: 'LISTED',
      timestamp: Math.floor(Date.now() / 1000),
      buyer: `${newDatasetData.owner.slice(0, 6)}...${newDatasetData.owner.slice(-4)}`,
      txnHash,
    };
    setLiveEvents(prev => [liveEvt, ...prev.slice(0, 19)]);

    return createdDataset;
  };

  /**
   * Delist dataset
   */
  const delistDataset = async (datasetId: string, txnHash: string) => {
    setDatasets(prev => 
      prev.map(d => {
        if (d.id === datasetId) {
          return { ...d, isDelisted: true };
        }
        return d;
      })
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        datasets,
        paidHistory,
        liveEvents,
        currentReadRate,
        totalRevenue24h,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredDatasets,
        executePaidRead,
        registerNewDataset,
        delistDataset,
        getDatasetById,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
