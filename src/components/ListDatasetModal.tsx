import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { DatasetCategory } from '../types';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Coins, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { getExplorerTxnUrl } from '../services/aptos';

interface ListDatasetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ListDatasetModal: React.FC<ListDatasetModalProps> = ({ onClose, onSuccess }) => {
  const { isConnected, address, connectWallet, signListingTransaction } = useWallet();
  const { registerNewDataset } = useMarketplace();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<DatasetCategory>('Finance');
  const [description, setDescription] = useState('');
  const [priceApt, setPriceApt] = useState<string>('0.05');
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [step, setStep] = useState<'form' | 'signing' | 'uploading' | 'completed' | 'failed'>('form');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        try {
          const parsed = JSON.parse(text);
          setFileContent(parsed);
        } catch {
          // If not pure JSON, use structured preview
          setFileContent({
            raw_preview: text.slice(0, 1000),
            filename: selectedFile.name,
            sizeBytes: selectedFile.size,
          });
        }
      } catch (err) {
        console.warn('File read error:', err);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      await connectWallet();
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter a dataset name');
      return;
    }

    const parsedPrice = parseFloat(priceApt);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('Please enter a valid price in APT');
      return;
    }

    setErrorMsg(null);
    setStep('signing');

    try {
      // 1. Sign registration transaction on Aptos
      const signResult = await signListingTransaction();
      
      if (!signResult.success || !signResult.txnHash) {
        setStep('failed');
        setErrorMsg(signResult.error || 'Registration signature was canceled. Dataset was not listed.');
        return;
      }

      setTxnHash(signResult.txnHash);
      setStep('uploading');

      // 2. Upload to Shelby Protocol & commit to state
      const octas = Math.round(parsedPrice * 100_000_000);
      const defaultSample = fileContent || {
        stream_type: `${category} Telemetry`,
        schema: "Moreman-Shelby-v1",
        record_count: 5000,
        sample_entry: {
          metric: "alpha_index",
          value: 98.42,
          timestamp: new Date().toISOString()
        }
      };

      await registerNewDataset(
        {
          name: name.trim(),
          category,
          description: description.trim() || 'High-throughput streaming dataset provisioned via Shelby Protocol.',
          owner: address,
          pricePerReadApt: parsedPrice,
          pricePerReadOctas: octas,
          fileType: file ? file.name.split('.').pop()?.toUpperCase() || 'JSON' : 'JSON Stream',
          fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '2.4 GB (Live Stream)',
          sampleData: defaultSample,
          isCustom: true,
        },
        defaultSample,
        signResult.txnHash
      );

      setStep('completed');
      onSuccess();
    } catch (err: any) {
      console.error('List dataset error:', err);
      setStep('failed');
      setErrorMsg(err?.message || 'Failed to list dataset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181d1a] border border-[#85d6b8]/40 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_30px_rgba(133,214,184,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f4944]/40 bg-[#101412]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#85d6b8]" />
            <h3 className="font-bold text-lg text-[#e0e3e0] font-sans">
              List Dataset on Shelby Protocol
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'form' && (
            <form id="list-dataset-form" onSubmit={handleSubmitListing} className="space-y-4 font-mono text-xs">
              {errorMsg && (
                <div className="p-3 bg-[#93000a]/20 border border-[#ffb4ab]/40 rounded-lg text-[#ffb4ab]">
                  {errorMsg}
                </div>
              )}

              {/* Dataset Name */}
              <div>
                <label className="block text-[#bec9c3] mb-1.5 text-[11px] uppercase tracking-wider font-bold">
                  Dataset Name *
                </label>
                <input
                  id="input-dataset-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., DeepQuant Alpha Model Feed v2"
                  className="w-full bg-[#101412] border border-[#3f4944] focus:border-[#85d6b8] focus:ring-1 focus:ring-[#85d6b8] rounded-lg px-3.5 py-2.5 text-[#e0e3e0] placeholder-[#88938d] focus:outline-none"
                />
              </div>

              {/* Category & Price Per Read */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#bec9c3] mb-1.5 text-[11px] uppercase tracking-wider font-bold">
                    Category *
                  </label>
                  <select
                    id="input-dataset-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DatasetCategory)}
                    className="w-full bg-[#101412] border border-[#3f4944] focus:border-[#85d6b8] rounded-lg px-3.5 py-2.5 text-[#e0e3e0] focus:outline-none"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Satellite">Satellite</option>
                    <option value="IoT">IoT</option>
                    <option value="AI Models">AI Models</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Climate">Climate</option>
                    <option value="Custom">Custom / General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#bec9c3] mb-1.5 text-[11px] uppercase tracking-wider font-bold">
                    Price Per Read (APT) *
                  </label>
                  <div className="relative">
                    <input
                      id="input-dataset-price"
                      type="number"
                      step="0.001"
                      min="0.001"
                      required
                      value={priceApt}
                      onChange={(e) => setPriceApt(e.target.value)}
                      placeholder="0.05"
                      className="w-full bg-[#101412] border border-[#3f4944] focus:border-[#85d6b8] rounded-lg pl-3.5 pr-14 py-2.5 text-[#85d6b8] font-bold focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#88938d] text-xs">
                      APT
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#bec9c3] mb-1.5 text-[11px] uppercase tracking-wider font-bold">
                  Description &amp; Specifications
                </label>
                <textarea
                  id="input-dataset-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dataset's contents, update frequency, formatting, and target AI use case..."
                  className="w-full bg-[#101412] border border-[#3f4944] focus:border-[#85d6b8] rounded-lg px-3.5 py-2 text-[#e0e3e0] placeholder-[#88938d] focus:outline-none"
                />
              </div>

              {/* File Upload / Drag & Drop */}
              <div>
                <label className="block text-[#bec9c3] mb-1.5 text-[11px] uppercase tracking-wider font-bold">
                  Dataset Sample / Chunk Payload
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#85d6b8] bg-[#85d6b8]/10'
                      : 'border-[#3f4944] hover:border-[#85d6b8]/60 bg-[#101412]'
                  }`}
                  onClick={() => document.getElementById('dataset-file-input')?.click()}
                >
                  <input
                    id="dataset-file-input"
                    type="file"
                    accept=".json,.csv,.parquet,.txt,.fasta"
                    className="hidden"
                    onChange={handleFileInput}
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3 text-[#73e6cb]">
                      <FileText className="w-6 h-6" />
                      <div className="text-left font-mono">
                        <div className="font-bold text-xs">{file.name}</div>
                        <div className="text-[10px] text-[#bec9c3]">
                          {(file.size / 1024).toFixed(1)} KB &bull; Ready for Shelby Blob storage
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-8 h-8 text-[#85d6b8]/70 mx-auto mb-2" />
                      <div className="text-xs text-[#e0e3e0] font-bold">
                        Drop your dataset file here or click to browse
                      </div>
                      <div className="text-[10px] text-[#88938d] mt-1">
                        Supports JSON, CSV, Parquet, Text &bull; Auto-encrypted for Shelby stream reader
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informational Callout */}
              <div className="p-3 bg-[#00251c] border border-[#85d6b8]/30 rounded-lg flex items-start gap-2.5 text-[11px] text-[#bec9c3]">
                <ShieldCheck className="w-4 h-4 text-[#73e6cb] flex-shrink-0 mt-0.5" />
                <p>
                  Listing requires a one-time wallet signature to anchor registration on the Aptos network. The dataset only goes live once confirmed.
                </p>
              </div>
            </form>
          )}

          {step === 'signing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#85d6b8] animate-spin mx-auto" />
              <h4 className="text-lg font-bold text-[#e0e3e0]">
                Awaiting Wallet Signature
              </h4>
              <p className="text-xs text-[#bec9c3] max-w-md mx-auto font-mono">
                Please confirm the registration transaction in your Petra wallet to anchor this dataset listing on the Aptos blockchain.
              </p>
            </div>
          )}

          {step === 'uploading' && (
            <div className="py-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-[#73e6cb] animate-pulse mx-auto" />
              <h4 className="text-lg font-bold text-[#e0e3e0]">
                Registering on Shelby Protocol
              </h4>
              <p className="text-xs text-[#bec9c3] max-w-md mx-auto font-mono">
                Generating decentralized blob ID, configuring streaming endpoints, and indexing metadata...
              </p>
              {txnHash && (
                <div className="font-mono text-xs text-[#85d6b8] truncate max-w-md mx-auto">
                  Txn: {txnHash}
                </div>
              )}
            </div>
          )}

          {step === 'completed' && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-[#73e6cb] mx-auto" />
              <h4 className="text-xl font-bold text-[#e0e3e0]">
                Dataset Successfully Listed!
              </h4>
              <p className="text-xs text-[#bec9c3] max-w-md mx-auto font-mono">
                Your dataset is now live in the Data Hub marketplace. AI developers and researchers can now query and pay {priceApt} APT per read directly to your wallet.
              </p>
              {txnHash && (
                <a
                  href={getExplorerTxnUrl(txnHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#101412] text-[#85d6b8] border border-[#85d6b8]/40 font-mono text-xs hover:border-[#85d6b8]"
                >
                  <span>View Registration on Aptos Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {step === 'failed' && (
            <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 p-6 rounded-lg text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-[#ffb4ab] mx-auto" />
              <h4 className="font-bold text-sm text-[#ffb4ab]">
                Listing Cancelled or Failed
              </h4>
              <p className="text-xs text-[#bec9c3] font-mono leading-relaxed max-w-md mx-auto">
                {errorMsg || 'The listing registration was canceled by the user. Nothing was listed.'}
              </p>
              <button
                onClick={() => setStep('form')}
                className="mt-4 px-5 py-2 rounded bg-[#181d1a] border border-[#85d6b8]/40 text-[#85d6b8] text-xs font-mono font-bold hover:bg-[#85d6b8]/10"
              >
                Return to Form
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#101412] border-t border-[#3f4944]/40 flex items-center justify-between">
          {step === 'form' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono text-[#bec9c3] hover:text-[#e0e3e0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="list-dataset-form"
                className="px-6 py-2.5 rounded-lg bg-[#85d6b8] hover:bg-[#a1f3d3] text-[#003829] font-bold font-sans text-xs glow-hover flex items-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Sign &amp; Publish Listing</span>
              </button>
            </>
          )}

          {step === 'completed' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#85d6b8] text-[#003829] font-bold text-xs"
            >
              Done
            </button>
          )}

          {(step === 'signing' || step === 'uploading') && (
            <div className="text-xs font-mono text-[#88938d] text-center w-full">
              Broadcasting registration to Aptos &amp; Shelby...
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
