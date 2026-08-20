import React, { useState } from 'react';
import { PaidReadRecord } from '../types';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { getExplorerTxnUrl, formatAddress } from '../services/aptos';

interface RetrievedDataModalProps {
  record: PaidReadRecord;
  onClose: () => void;
}

export const RetrievedDataModal: React.FC<RetrievedDataModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(record.dataSnippet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record.dataSnippet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${record.datasetName.toLowerCase().replace(/\s+/g, '_')}_chunk.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181d1a] border border-[#85d6b8]/40 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f4944]/40 bg-[#101412]">
          <div className="flex items-center gap-2 text-[#73e6cb]">
            <Terminal className="w-5 h-5" />
            <h3 className="font-bold text-base text-[#e0e3e0] font-sans">
              Decrypted Shelby Stream Chunk
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bec9c3] hover:text-[#e0e3e0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Metadata banner */}
          <div className="bg-[#101412] p-4 rounded-lg border border-[#3f4944]/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#85d6b8] text-sm">{record.datasetName}</span>
              <span className="text-[#73e6cb] bg-[#00513e]/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED SETTLEMENT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#bec9c3] pt-1">
              <div>Owner: <span className="text-[#e0e3e0]">{formatAddress(record.ownerAddress)}</span></div>
              <div>Paid Amount: <span className="text-[#85d6b8] font-bold">{record.priceApt} APT</span></div>
              <div>Shelby Blob: <span className="text-[#88938d] truncate block">{record.shelbyStreamId}</span></div>
              <div>Timestamp: <span className="text-[#88938d]">{new Date(record.timestamp).toLocaleString()}</span></div>
            </div>

            <div className="pt-2 border-t border-[#3f4944]/30 flex items-center justify-between text-[11px]">
              <span className="text-[#88938d]">On-Chain Transaction:</span>
              <a
                href={getExplorerTxnUrl(record.txnHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#85d6b8] hover:underline flex items-center gap-1"
              >
                <span>{record.txnHash.slice(0, 16)}...</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* JSON Payload View */}
          <div className="border border-[#3f4944] rounded-lg overflow-hidden bg-[#0a0f0d]">
            <div className="bg-[#101412] px-4 py-2 border-b border-[#3f4944]/40 flex items-center justify-between">
              <span className="text-[#bec9c3] text-[11px]">PAYLOAD_INSPECT</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-[#181d1a] hover:bg-[#85d6b8]/20 text-[#bec9c3] hover:text-[#85d6b8] flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-[#73e6cb]" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2 py-1 rounded bg-[#181d1a] hover:bg-[#85d6b8]/20 text-[#bec9c3] hover:text-[#85d6b8] flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-4 max-h-72 overflow-y-auto text-[#85d6b8] text-xs">
              <pre>{JSON.stringify(record.dataSnippet, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#101412] border-t border-[#3f4944]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold font-sans text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
