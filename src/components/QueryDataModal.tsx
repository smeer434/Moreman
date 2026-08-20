import React, { useState } from 'react';
import { Dataset } from '../types';
import { useWallet } from '../context/WalletContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Coins, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  Terminal,
  Server
} from 'lucide-react';
import { formatAddress, getExplorerTxnUrl } from '../services/aptos';

interface QueryDataModalProps {
  dataset: Dataset;
  onClose: () => void;
}

export const QueryDataModal: React.FC<QueryDataModalProps> = ({ dataset, onClose }) => {
  const { isConnected, address, connectWallet, payForRead } = useWallet();
  const { executePaidRead } = useMarketplace();

  const [step, setStep] = useState<'preview' | 'signing' | 'confirming' | 'completed' | 'failed'>('preview');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [latencyMs, setLatencyMs] = useState<number>(160);
  const [copiedData, setCopiedData] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);

  const octasAmount = Math.round(dataset.pricePerReadApt * 100_000_000);

  const handlePayAndRead = async () => {
    if (!isConnected || !address) {
      await connectWallet();
      return;
    }

    setErrorMsg(null);
    setStep('signing');

    try {
      // 1. Trigger real Aptos transfer to dataset owner address with exact price
      const paymentResult = await payForRead(dataset.owner, dataset.pricePerReadApt);

      if (!paymentResult.success || !paymentResult.txnHash) {
        setStep('failed');
        setErrorMsg(paymentResult.error || 'Payment was canceled or rejected by user. Access not granted.');
        return;
      }

      setTxnHash(paymentResult.txnHash);
      setStep('confirming');

      // 2. Fetch and decrypt Shelby high-frequency stream upon confirmed txn receipt
      const readResult = await executePaidRead(dataset, address, paymentResult.txnHash);
      
      setRetrievedData(readResult.sampleData);
      setLatencyMs(readResult.latencyMs);
      setStep('completed');
    } catch (err: any) {
      console.error('Pay and read error:', err);
      setStep('failed');
      setErrorMsg(err?.message || 'Failed to process paid read transaction.');
    }
  };

  const handleCopyData = () => {
    if (retrievedData) {
      navigator.clipboard.writeText(JSON.stringify(retrievedData, null, 2));
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    if (retrievedData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(retrievedData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${dataset.id}_query_result.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181d1a] border border-[#85d6b8]/40 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_30px_rgba(133,214,184,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f4944]/40 bg-[#101412]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#73e6cb] animate-pulse" />
            <h3 className="font-bold text-lg text-[#e0e3e0] font-sans">
              Query Dataset Stream
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bec9c3] hover:text-[#e0e3e0] hover:bg-[#85d6b8]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: PREVIEW & ORDER SUMMARY */}
          {step === 'preview' && (
            <>
              <div className="bg-[#101412] p-4 rounded-lg border border-[#3f4944]/50">
                <div className="text-[11px] font-mono text-[#85d6b8] uppercase tracking-wider mb-1">
                  {dataset.category} DATASET
                </div>
                <h4 className="text-xl font-bold text-[#e0e3e0] mb-2">{dataset.name}</h4>
                <p className="text-xs text-[#bec9c3] leading-relaxed mb-4">{dataset.description}</p>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs border-t border-[#3f4944]/40 pt-3">
                  <div>
                    <span className="text-[#88938d] block text-[10px]">RECIPIENT (OWNER)</span>
                    <span className="text-[#e0e3e0] font-bold truncate block" title={dataset.owner}>
                      {formatAddress(dataset.owner, 4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#88938d] block text-[10px]">SHELBY PROTOCOL BLOB</span>
                    <span className="text-[#73e6cb] truncate block">{dataset.shelbyBlobId}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown Card */}
              <div className="bg-[#00251c] border border-[#85d6b8]/40 p-4 rounded-lg font-mono text-xs space-y-2.5">
                <div className="flex justify-between items-center text-[#bec9c3]">
                  <span>Query Access Fee:</span>
                  <span className="text-sm font-bold text-[#85d6b8]">{dataset.pricePerReadApt} APT</span>
                </div>
                <div className="flex justify-between items-center text-[#88938d] text-[11px]">
                  <span>Amount in Octas:</span>
                  <span>{octasAmount.toLocaleString()} octas</span>
                </div>
                <div className="flex justify-between items-center text-[#88938d] text-[11px]">
                  <span>Network Gas Estimate:</span>
                  <span>~0.0002 APT</span>
                </div>
                <div className="pt-2 border-t border-[#85d6b8]/20 flex justify-between items-center text-[#e0e3e0] font-bold">
                  <span>Total Due Instantly to Owner:</span>
                  <span className="text-[#73e6cb] text-base">{dataset.pricePerReadApt} APT</span>
                </div>
              </div>

              {/* Protocol Settlement Guarantee */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#101412] border border-[#3f4944]/40 text-xs text-[#bec9c3] font-mono">
                <ShieldCheck className="w-5 h-5 text-[#85d6b8] flex-shrink-0 mt-0.5" />
                <p className="leading-tight">
                  Payment is routed directly to the dataset creator's wallet via <code className="text-[#85d6b8]">0x1::aptos_account::transfer</code>. Data stream access is released only upon valid on-chain confirmation.
                </p>
              </div>
            </>
          )}

          {/* STEP 2: SIGNING WALLET TXN */}
          {step === 'signing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#85d6b8] animate-spin mx-auto" />
              <h4 className="text-lg font-bold text-[#e0e3e0]">
                Awaiting Wallet Signature
              </h4>
              <p className="text-xs text-[#bec9c3] max-w-md mx-auto font-mono">
                Please approve the transaction of <strong>{dataset.pricePerReadApt} APT</strong> ({octasAmount} octas) in your Petra wallet to unlock the Shelby data stream.
              </p>
              <div className="p-3 bg-[#101412] rounded border border-[#3f4944]/40 max-w-sm mx-auto font-mono text-[11px] text-[#88938d]">
                Transfer recipient: {formatAddress(dataset.owner, 6)}
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMING ON-CHAIN */}
          {step === 'confirming' && (
            <div className="py-12 text-center space-y-4">
              <Server className="w-12 h-12 text-[#73e6cb] animate-pulse mx-auto" />
              <h4 className="text-lg font-bold text-[#e0e3e0]">
                Confirming on Aptos &amp; Fetching Shelby Stream
              </h4>
              <p className="text-xs text-[#bec9c3] max-w-md mx-auto font-mono">
                Transaction submitted! Verifying proof and decrypting high-frequency data payload...
              </p>
              {txnHash && (
                <div className="font-mono text-xs text-[#85d6b8] truncate max-w-md mx-auto">
                  Txn: {txnHash}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: COMPLETED / DATA REVEALED */}
          {step === 'completed' && retrievedData && (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="bg-[#00281e] border border-[#73e6cb] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#73e6cb]" />
                  <div>
                    <div className="font-bold text-xs text-[#73e6cb]">Paid Read Authorized</div>
                    <div className="text-[11px] font-mono text-[#bec9c3]">
                      Shelby read completed in {latencyMs}ms with verified ZK receipt
                    </div>
                  </div>
                </div>

                {txnHash && (
                  <a
                    href={getExplorerTxnUrl(txnHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#101412] text-[#85d6b8] hover:text-[#a1f3d3] font-mono text-xs border border-[#85d6b8]/30 hover:border-[#85d6b8]"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* JSON Data Viewer Terminal */}
              <div className="border border-[#3f4944] rounded-lg overflow-hidden bg-[#0a0f0d]">
                <div className="bg-[#101412] px-4 py-2 border-b border-[#3f4944]/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#85d6b8]">
                    <Terminal className="w-4 h-4" />
                    <span>DECRYPTED_STREAM_PAYLOAD.JSON</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyData}
                      className="px-2.5 py-1 rounded bg-[#181d1a] hover:bg-[#85d6b8]/20 text-[#bec9c3] hover:text-[#85d6b8] flex items-center gap-1.5 transition-colors"
                    >
                      {copiedData ? <Check className="w-3.5 h-3.5 text-[#73e6cb]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedData ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownloadJSON}
                      className="px-2.5 py-1 rounded bg-[#181d1a] hover:bg-[#85d6b8]/20 text-[#bec9c3] hover:text-[#85d6b8] flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 max-h-72 overflow-y-auto font-mono text-xs text-[#85d6b8]">
                  <pre>{JSON.stringify(retrievedData, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FAILED / REJECTED */}
          {step === 'failed' && (
            <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 p-6 rounded-lg text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-[#ffb4ab] mx-auto" />
              <h4 className="font-bold text-sm text-[#ffb4ab]">
                Paid Read Unsuccessful
              </h4>
              <p className="text-xs text-[#bec9c3] font-mono leading-relaxed max-w-md mx-auto">
                {errorMsg || 'The transaction was canceled or failed on Aptos Shelbynet. No payment was deducted, and dataset access was withheld.'}
              </p>
              <button
                onClick={() => setStep('preview')}
                className="mt-4 px-5 py-2 rounded bg-[#181d1a] border border-[#85d6b8]/40 text-[#85d6b8] text-xs font-mono font-bold hover:bg-[#85d6b8]/10"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#101412] border-t border-[#3f4944]/40 flex items-center justify-between">
          {step === 'preview' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono text-[#bec9c3] hover:text-[#e0e3e0]"
              >
                Cancel
              </button>

              <button
                id="confirm-pay-to-read-btn"
                onClick={handlePayAndRead}
                className="px-6 py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold font-sans text-xs glow-hover flex items-center gap-2 shadow-[0_0_15px_rgba(133,214,184,0.3)] cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Pay {dataset.pricePerReadApt} APT &amp; Query</span>
              </button>
            </>
          )}

          {step === 'completed' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold text-xs font-sans text-center cursor-pointer"
            >
              Done
            </button>
          )}

          {(step === 'signing' || step === 'confirming') && (
            <div className="text-xs font-mono text-[#88938d] text-center w-full">
              Do not close window while transaction is processing...
            </div>
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
