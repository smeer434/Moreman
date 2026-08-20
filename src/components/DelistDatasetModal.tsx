import React, { useState } from 'react';
import { Dataset } from '../types';
import { useWallet } from '../context/WalletContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { getExplorerTxnUrl } from '../services/aptos';

interface DelistDatasetModalProps {
  dataset: Dataset;
  onClose: () => void;
  onSuccess: () => void;
}

export const DelistDatasetModal: React.FC<DelistDatasetModalProps> = ({
  dataset,
  onClose,
  onSuccess,
}) => {
  const { signDelistingTransaction } = useWallet();
  const { delistDataset } = useMarketplace();

  const [step, setStep] = useState<'confirm' | 'signing' | 'completed' | 'failed'>('confirm');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);

  const handleConfirmDelist = async () => {
    setErrorMsg(null);
    setStep('signing');

    try {
      // Must prompt real wallet signature for delisting confirmation
      const delistResult = await signDelistingTransaction();

      if (!delistResult.success || !delistResult.txnHash) {
        setStep('failed');
        setErrorMsg(delistResult.error || 'Delisting transaction was cancelled by user. Dataset remains listed.');
        return;
      }

      setTxnHash(delistResult.txnHash);
      await delistDataset(dataset.id, delistResult.txnHash);
      setStep('completed');
      onSuccess();
    } catch (err: any) {
      console.error('Delist error:', err);
      setStep('failed');
      setErrorMsg(err?.message || 'Failed to confirm delisting on Aptos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181d1a] border border-[#ffb4ab]/40 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f4944]/40 bg-[#101412]">
          <div className="flex items-center gap-2 text-[#ffb4ab]">
            <Trash2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-[#e0e3e0] font-sans">
              Confirm Dataset Delisting
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bec9c3] hover:text-[#e0e3e0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-xs space-y-4">
          {step === 'confirm' && (
            <>
              <div className="p-4 bg-[#101412] rounded-lg border border-[#3f4944]/50">
                <div className="text-[11px] text-[#88938d] uppercase">Dataset to Delist</div>
                <div className="text-base font-bold text-[#e0e3e0] mt-1">{dataset.name}</div>
                <div className="text-[11px] text-[#bec9c3] mt-0.5">Category: {dataset.category} &bull; Total Reads: {dataset.totalReads}</div>
                <div className="text-[10px] text-[#88938d] mt-1">Shelby Blob: {dataset.shelbyBlobId}</div>
              </div>

              <div className="p-3 bg-[#93000a]/15 border border-[#ffb4ab]/30 rounded-lg text-[#ffb4ab] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Delisting requires an on-chain wallet signature to close active high-frequency streaming routes. Canceling this prompt will leave the dataset listed.
                </p>
              </div>
            </>
          )}

          {step === 'signing' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#85d6b8] animate-spin mx-auto" />
              <div className="text-sm font-bold text-[#e0e3e0]">Awaiting Wallet Confirmation</div>
              <div className="text-xs text-[#bec9c3]">Please sign the delisting transaction in Petra wallet...</div>
            </div>
          )}

          {step === 'completed' && (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#73e6cb] mx-auto" />
              <div className="text-base font-bold text-[#e0e3e0]">Dataset Delisted Successfully</div>
              <div className="text-xs text-[#bec9c3]">The dataset has been withdrawn from public discovery on the Data Hub.</div>
              {txnHash && (
                <a
                  href={getExplorerTxnUrl(txnHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#85d6b8] hover:underline text-xs mt-2"
                >
                  <span>View Delisting on Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {step === 'failed' && (
            <div className="p-4 bg-[#93000a]/20 border border-[#ffb4ab]/40 rounded-lg text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-[#ffb4ab] mx-auto" />
              <div className="font-bold text-[#ffb4ab]">Delisting Canceled</div>
              <div className="text-xs text-[#bec9c3]">{errorMsg || 'The transaction was cancelled. The dataset remains listed.'}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#101412] border-t border-[#3f4944]/40 flex items-center justify-between">
          {step === 'confirm' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono text-[#bec9c3] hover:text-[#e0e3e0]"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelist}
                className="px-5 py-2.5 rounded-lg bg-[#93000a] hover:bg-[#b3000c] text-white font-bold font-sans text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sign &amp; Delist</span>
              </button>
            </>
          )}

          {step === 'completed' && (
            <button
              onClick={onClose}
              className="w-full py-2 rounded bg-[#85d6b8] text-[#003829] font-bold text-xs"
            >
              Done
            </button>
          )}

          {step === 'failed' && (
            <button
              onClick={onClose}
              className="w-full py-2 rounded bg-[#181d1a] border border-[#3f4944] text-[#bec9c3] text-xs font-mono"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
