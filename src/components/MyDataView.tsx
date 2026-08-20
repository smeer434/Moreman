import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useWallet } from '../context/WalletContext';
import { Dataset, PaidReadRecord } from '../types';
import { 
  Database, 
  Layers, 
  History, 
  Plus, 
  Trash2, 
  Coins, 
  Activity, 
  Wallet, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  Inbox,
  AlertCircle
} from 'lucide-react';
import { formatAddress, getExplorerAddressUrl, getExplorerTxnUrl } from '../services/aptos';

interface MyDataViewProps {
  onOpenListModal: () => void;
  onOpenDelistModal: (dataset: Dataset) => void;
  onViewRetrievedData: (record: PaidReadRecord) => void;
}

export const MyDataView: React.FC<MyDataViewProps> = ({
  onOpenListModal,
  onOpenDelistModal,
  onViewRetrievedData,
}) => {
  const { datasets, paidHistory } = useMarketplace();
  const { isConnected, address, balance, connectWallet } = useWallet();

  const [activeSubTab, setActiveSubTab] = useState<'my-listed' | 'paid-history'>('my-listed');

  // Filter datasets listed by the connected wallet only
  const myListedDatasets = datasets.filter(d => 
    !d.isDelisted && address && d.owner.toLowerCase() === address.toLowerCase()
  );

  // Filter paid query history made by the connected wallet only
  const myPaidHistory = paidHistory.filter(record => 
    address && record.buyerAddress.toLowerCase() === address.toLowerCase()
  );

  // Calculate real revenue earned by the user's listed datasets
  const totalEarnedApt = myListedDatasets.reduce((sum, d) => sum + (d.pricePerReadApt * d.totalReads), 0);
  const totalReadsServed = myListedDatasets.reduce((sum, d) => sum + d.totalReads, 0);

  if (!isConnected || !address) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-16">
        <div className="max-w-xl mx-auto bg-[#181d1a] tech-border rounded-xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#00513e]/40 border border-[#85d6b8]/40 flex items-center justify-center text-[#85d6b8] mx-auto mb-6 shadow-[0_0_20px_rgba(133,214,184,0.2)]">
            <Wallet className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#e0e3e0] mb-3 font-sans">
            Connect Petra Wallet
          </h2>

          <p className="text-sm text-[#bec9c3] font-mono leading-relaxed mb-8">
            Connect your Petra Aptos wallet to manage your listed datasets, collect read revenue, and inspect your decrypted stream history
          </p>

          <button
            onClick={() => connectWallet()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold text-sm glow-hover shadow-[0_0_20px_rgba(133,214,184,0.35)] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Petra Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#e0e3e0] font-sans">
            My Data Center
          </h1>
          <p className="text-xs md:text-sm text-[#bec9c3] mt-2 font-mono uppercase tracking-wider">
            MANAGE LISTINGS &bull; COLLECT REVENUE &bull; QUERY HISTORY
          </p>
        </div>

        <button
          onClick={onOpenListModal}
          className="px-6 py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold text-xs glow-hover shadow-[0_0_15px_rgba(133,214,184,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>List New Dataset</span>
        </button>
      </div>

      {/* Account Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
        <div className="bg-[#181d1a] tech-border p-5 rounded-lg">
          <div className="text-[11px] text-[#88938d] uppercase tracking-wider flex items-center justify-between">
            <span>WALLET BALANCE</span>
            <Wallet className="w-3.5 h-3.5 text-[#85d6b8]" />
          </div>
          <div className="text-2xl font-bold text-[#85d6b8] mt-2">
            {balance.toFixed(4)} <span className="text-xs text-[#bec9c3]">APT</span>
          </div>
          <a
            href={getExplorerAddressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#88938d] hover:text-[#85d6b8] flex items-center gap-1 mt-2"
          >
            <span>{formatAddress(address, 5)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-[#181d1a] tech-border p-5 rounded-lg">
          <div className="text-[11px] text-[#88938d] uppercase tracking-wider flex items-center justify-between">
            <span>MY ACTIVE LISTINGS</span>
            <Database className="w-3.5 h-3.5 text-[#73e6cb]" />
          </div>
          <div className="text-2xl font-bold text-[#73e6cb] mt-2">
            {myListedDatasets.length} <span className="text-xs text-[#bec9c3]">Datasets</span>
          </div>
          <div className="text-[11px] text-[#88938d] mt-2">
            Streaming on Shelby Protocol
          </div>
        </div>

        <div className="bg-[#181d1a] tech-border p-5 rounded-lg">
          <div className="text-[11px] text-[#88938d] uppercase tracking-wider flex items-center justify-between">
            <span>TOTAL READS SERVED</span>
            <Activity className="w-3.5 h-3.5 text-[#85d6b8]" />
          </div>
          <div className="text-2xl font-bold text-[#e0e3e0] mt-2">
            {totalReadsServed}
          </div>
          <div className="text-[11px] text-[#88938d] mt-2">
            High-frequency paid queries
          </div>
        </div>

        <div className="bg-[#181d1a] tech-border p-5 rounded-lg">
          <div className="text-[11px] text-[#88938d] uppercase tracking-wider flex items-center justify-between">
            <span>EST. EARNED REVENUE</span>
            <Coins className="w-3.5 h-3.5 text-[#73e6cb]" />
          </div>
          <div className="text-2xl font-bold text-[#73e6cb] mt-2">
            {totalEarnedApt.toFixed(4)} <span className="text-xs text-[#bec9c3]">APT</span>
          </div>
          <div className="text-[11px] text-[#88938d] mt-2">
            Paid directly to your wallet
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#3f4944]/50 mb-6 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('my-listed')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'my-listed'
              ? 'border-[#85d6b8] text-[#85d6b8]'
              : 'border-transparent text-[#bec9c3] hover:text-[#e0e3e0]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Listed Datasets ({myListedDatasets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('paid-history')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'paid-history'
              ? 'border-[#85d6b8] text-[#85d6b8]'
              : 'border-transparent text-[#bec9c3] hover:text-[#e0e3e0]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Query &amp; Purchase History ({myPaidHistory.length})</span>
        </button>
      </div>

      {/* Content 1: My Listed Datasets */}
      {activeSubTab === 'my-listed' && (
        <div>
          {myListedDatasets.length === 0 ? (
            <div className="bg-[#181d1a] tech-border rounded-lg p-12 text-center my-4">
              <div className="w-14 h-14 rounded-full bg-[#00513e]/20 border border-[#85d6b8]/40 flex items-center justify-center text-[#85d6b8] mx-auto mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#e0e3e0] mb-2 font-sans">
                No Datasets Listed Yet
              </h3>
              <p className="text-xs font-mono text-[#bec9c3] max-w-md mx-auto mb-6 leading-relaxed">
                You have not listed any datasets for monetization on Shelby Protocol under this wallet address
              </p>
              <button
                onClick={onOpenListModal}
                className="px-6 py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold text-xs glow-hover transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>List a Dataset</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListedDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="bg-[#181d1a] tech-border rounded-lg p-6 flex flex-col justify-between shadow-lg group relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#85d6b8]/10 text-[#85d6b8] border border-[#85d6b8]/30">
                        {dataset.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#73e6cb] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE STREAM
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#e0e3e0] font-sans mb-2 group-hover:text-[#85d6b8] transition-colors">
                      {dataset.name}
                    </h3>

                    <p className="text-xs text-[#bec9c3] mb-4 line-clamp-2 leading-relaxed">
                      {dataset.description}
                    </p>

                    <div className="bg-[#101412] p-3 rounded border border-[#3f4944]/40 font-mono text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#88938d]">Price Per Read:</span>
                        <span className="text-[#85d6b8] font-bold">{dataset.pricePerReadApt} APT</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#88938d]">Reads Served:</span>
                        <span className="text-[#e0e3e0] font-bold">{dataset.totalReads}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#88938d]">Earned:</span>
                        <span className="text-[#73e6cb] font-bold">{(dataset.pricePerReadApt * dataset.totalReads).toFixed(4)} APT</span>
                      </div>
                      <div className="text-[10px] text-[#88938d] truncate pt-1 border-t border-[#3f4944]/30">
                        Shelby: {dataset.shelbyBlobId}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#3f4944]/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#88938d]">
                      {new Date(dataset.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => onOpenDelistModal(dataset)}
                      className="px-3 py-1.5 rounded bg-[#93000a]/20 border border-[#ffb4ab]/30 hover:bg-[#93000a] text-[#ffb4ab] hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delist</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content 2: Paid Query & Decrypted Chunk History */}
      {activeSubTab === 'paid-history' && (
        <div>
          {myPaidHistory.length === 0 ? (
            <div className="bg-[#181d1a] tech-border rounded-lg p-12 text-center my-4">
              <div className="w-14 h-14 rounded-full bg-[#00513e]/20 border border-[#85d6b8]/40 flex items-center justify-center text-[#85d6b8] mx-auto mb-4">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#e0e3e0] mb-2 font-sans">
                No Paid Queries Recorded
              </h3>
              <p className="text-xs font-mono text-[#bec9c3] max-w-md mx-auto leading-relaxed">
                You have not queried any datasets with this connected wallet yet. Queries made in the Data Hub will appear here with on-chain transaction receipts and decrypted data chunks.
              </p>
            </div>
          ) : (
            <div className="bg-[#181d1a] tech-border rounded-lg overflow-hidden font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#101412] text-[#88938d] border-b border-[#3f4944]/50 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Dataset Name</th>
                      <th className="py-3 px-4">Owner Address</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Aptos Txn</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3f4944]/30">
                    {myPaidHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-[#101412]/50 transition-colors">
                        <td className="py-3.5 px-4 text-[#88938d]">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-[#e0e3e0] font-bold">
                          {record.datasetName}
                        </td>
                        <td className="py-3.5 px-4 text-[#bec9c3]">
                          {formatAddress(record.ownerAddress, 4)}
                        </td>
                        <td className="py-3.5 px-4 text-[#85d6b8] font-bold">
                          {record.priceApt} APT
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={getExplorerTxnUrl(record.txnHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#73e6cb] hover:underline flex items-center gap-1"
                          >
                            <span>{record.txnHash.slice(0, 10)}...</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#00513e]/30 text-[#73e6cb] border border-[#85d6b8]/20">
                            <CheckCircle2 className="w-3 h-3" />
                            CONFIRMED
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onViewRetrievedData(record)}
                            className="px-3 py-1.5 rounded bg-[#00513e]/40 border border-[#85d6b8]/40 hover:bg-[#85d6b8] text-[#85d6b8] hover:text-[#003829] font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Decrypted</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
