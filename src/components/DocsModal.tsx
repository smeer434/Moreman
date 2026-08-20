import React from 'react';
import { X, Code, Terminal, ShieldCheck, Zap, Layers, Server, ExternalLink, Cpu } from 'lucide-react';

interface DocsModalProps {
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181d1a] border border-[#85d6b8]/40 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f4944]/40 bg-[#101412]">
          <div className="flex items-center gap-2 text-[#85d6b8]">
            <Code className="w-5 h-5" />
            <h3 className="font-bold text-lg text-[#e0e3e0] font-sans">
              Moreman Protocol Documentation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bec9c3] hover:text-[#e0e3e0] hover:bg-[#85d6b8]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-mono text-xs text-[#bec9c3]">
          {/* Section 1: Overview */}
          <div>
            <h4 className="text-sm font-bold text-[#85d6b8] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#73e6cb]" />
              1. High-Frequency Paid Reads Overview
            </h4>
            <p className="leading-relaxed mb-3">
              Moreman is designed for real-time AI training datasets, financial sentiment pipelines, and IoT streams. Instead of upfront bulk purchases, buyers pay in micro-quantities of APT for individual queries via Shelby Protocol's high-frequency stream engine.
            </p>
          </div>

          {/* Section 2: On-Chain Aptos Settlement */}
          <div className="bg-[#101412] p-4 rounded-lg border border-[#3f4944]/50 space-y-2">
            <h4 className="text-sm font-bold text-[#e0e3e0] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#85d6b8]" />
              2. On-Chain Move Transfer Call
            </h4>
            <p className="text-[11px] text-[#bec9c3]">
              Every query triggers an atomic Aptos move transfer to the dataset creator's wallet:
            </p>
            <pre className="p-3 bg-[#080d0b] rounded border border-[#3f4944]/40 text-[#85d6b8] overflow-x-auto text-[11px]">
{`// 1 APT = 100,000,000 Octas
const payload = {
  function: "0x1::aptos_account::transfer",
  typeArguments: [],
  functionArguments: [
    ownerWalletAddress, // string: "0xabc...def"
    amountInOctas.toString() // e.g. "5000000" for 0.05 APT
  ]
};

const response = await petraWallet.signAndSubmitTransaction(payload);
await aptosClient.waitForTransaction({ transactionHash: response.hash });`}
            </pre>
          </div>

          {/* Section 3: Shelby SDK Reading Pattern */}
          <div className="bg-[#101412] p-4 rounded-lg border border-[#3f4944]/50 space-y-2">
            <h4 className="text-sm font-bold text-[#e0e3e0] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#73e6cb]" />
              3. Querying with Shelby Client
            </h4>
            <pre className="p-3 bg-[#080d0b] rounded border border-[#3f4944]/40 text-[#73e6cb] overflow-x-auto text-[11px]">
{`import { ShelbyClient } from '@shelby-protocol/sdk/browser';

const shelby = new ShelbyClient({
  network: 'shelbynet-testnet',
  rpcUrl: 'https://gateway.shelby.xyz/v1'
});

// Fetch authenticated stream chunk with on-chain payment proof
const streamChunk = await shelby.readPaidStream({
  blobId: 'shelby_blob_0x8f3c71a9',
  aptosTxnHash: txnReceipt.hash
});

console.log("Stream payload:", streamChunk.data);`}
            </pre>
          </div>

          {/* Section 4: Security & Latency Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#00251c] border border-[#85d6b8]/30 rounded-lg">
              <div className="text-[#85d6b8] font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero File Piracy</span>
              </div>
              <p className="text-[11px] text-[#bec9c3] leading-relaxed">
                Datasets are split into encrypted chunks indexed on Shelby nodes. Only requests backed by confirmed on-chain transactions receive decryption tokens.
              </p>
            </div>

            <div className="p-3.5 bg-[#00251c] border border-[#85d6b8]/30 rounded-lg">
              <div className="text-[#73e6cb] font-bold mb-1 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Sub-Second Latency</span>
              </div>
              <p className="text-[11px] text-[#bec9c3] leading-relaxed">
                Shelby stream buffers enable continuous reading throughput exceeding 40+ requests per second without congesting local mempools.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#101412] border-t border-[#3f4944]/40 flex items-center justify-between">
          <a
            href="https://aptos.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[#85d6b8] hover:underline"
          >
            <span>Aptos Dev Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>

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
