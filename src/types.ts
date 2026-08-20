export type DatasetCategory = 
  | 'Finance' 
  | 'Satellite' 
  | 'IoT' 
  | 'AI Models' 
  | 'Healthcare' 
  | 'Climate' 
  | 'Custom';

export interface Dataset {
  id: string;
  num: string;
  name: string;
  category: DatasetCategory;
  description: string;
  owner: string;
  totalReads: number;
  pricePerReadApt: number;
  pricePerReadOctas: number;
  shelbyBlobId: string;
  fileType: string;
  fileSize: string;
  createdAt: number;
  sampleData: Record<string, any> | Array<any>;
  isDelisted?: boolean;
  isCustom?: boolean;
}

export interface PaidReadRecord {
  id: string;
  datasetId: string;
  datasetName: string;
  ownerAddress: string;
  buyerAddress: string;
  priceApt: number;
  txnHash: string;
  timestamp: number;
  status: 'CONFIRMED' | 'FAILED' | 'REJECTED';
  dataSnippet: Record<string, any> | Array<any>;
  shelbyStreamId: string;
}

export interface LiveActivityEvent {
  id: string;
  dataset: string;
  req_id: string;
  status: string;
  fee_paid: string;
  timestamp: number;
  buyer: string;
  txnHash?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  balanceApt: number;
}
