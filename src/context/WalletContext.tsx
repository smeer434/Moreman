import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  buildTransferPayload, 
  buildListingRegistrationPayload, 
  buildDelistingPayload, 
  waitForAptosTxn, 
  getAccountBalance, 
  formatAddress 
} from '../services/aptos';

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  formattedAddress: string;
  balance: number;
  walletName: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  payForRead: (ownerAddress: string, priceApt: number) => Promise<{ success: boolean; txnHash?: string; error?: string }>;
  signListingTransaction: () => Promise<{ success: boolean; txnHash?: string; error?: string }>;
  signDelistingTransaction: () => Promise<{ success: boolean; txnHash?: string; error?: string }>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Local persistence key for wallet state
const WALLET_STORAGE_KEY = 'moreman_wallet_connected';
const WALLET_ADDR_KEY = 'moreman_wallet_address';

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return localStorage.getItem(WALLET_STORAGE_KEY) === 'true';
  });
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem(WALLET_ADDR_KEY) || null;
  });
  const [balance, setBalance] = useState<number>(0);
  const [walletName, setWalletName] = useState<string | null>('Petra Wallet');

  // Check if Petra or standard Aptos wallet is injected in window
  const getAptosWallet = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).aptos) return (window as any).aptos;
      if ((window as any).petra) return (window as any).petra;
    }
    return null;
  };

  const refreshBalance = async () => {
    if (address) {
      const bal = await getAccountBalance(address);
      setBalance(bal);
    }
  };

  useEffect(() => {
    const checkInitialConnection = async () => {
      const wallet = getAptosWallet();
      if (wallet && isConnected) {
        try {
          const isConnectedOnWallet = await wallet.isConnected?.();
          if (isConnectedOnWallet) {
            const account = await wallet.account();
            if (account?.address) {
              setAddress(account.address);
              localStorage.setItem(WALLET_ADDR_KEY, account.address);
              const bal = await getAccountBalance(account.address);
              setBalance(bal);
            }
          }
        } catch (e) {
          console.warn('Initial wallet check error:', e);
        }
      }
    };
    checkInitialConnection();
  }, [isConnected]);

  // Periodic real balance refresh when connected
  useEffect(() => {
    if (isConnected && address) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const wallet = getAptosWallet();
      if (wallet) {
        // Real Petra / Aptos wallet connection
        const response = await wallet.connect();
        const connectedAddress = response?.address || (await wallet.account())?.address;
        if (connectedAddress) {
          setAddress(connectedAddress);
          setIsConnected(true);
          setWalletName('Petra Wallet');
          localStorage.setItem(WALLET_STORAGE_KEY, 'true');
          localStorage.setItem(WALLET_ADDR_KEY, connectedAddress);
          const bal = await getAccountBalance(connectedAddress);
          setBalance(bal);
          return;
        }
      }

      throw new Error('Petra Wallet extension not detected. Please install the Petra Aptos Wallet browser extension (petra.app) and refresh.');
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      throw new Error(err?.message || 'Failed to connect Petra wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const wallet = getAptosWallet();
      if (wallet?.disconnect) {
        await wallet.disconnect();
      }
    } catch (e) {
      console.warn('Disconnect error:', e);
    } finally {
      setIsConnected(false);
      setAddress(null);
      setBalance(0);
      localStorage.removeItem(WALLET_STORAGE_KEY);
      localStorage.removeItem(WALLET_ADDR_KEY);
    }
  };

  /**
   * Real On-Chain Pay-Per-Read Flow:
   * Submits real on-chain transaction calling 0x1::aptos_account::transfer
   * and awaits confirmed execution on Aptos testnet before returning success.
   */
  const payForRead = async (
    ownerAddress: string, 
    priceApt: number
  ): Promise<{ success: boolean; txnHash?: string; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Please connect your Petra wallet first.' };
    }

    const wallet = getAptosWallet();
    if (!wallet || !wallet.signAndSubmitTransaction) {
      return { 
        success: false, 
        error: 'Petra wallet extension not available for signing. Please install Petra from petra.app.' 
      };
    }

    try {
      const payload = buildTransferPayload(ownerAddress, priceApt);
      const txnResponse = await wallet.signAndSubmitTransaction(payload);
      const hash = txnResponse?.hash || (typeof txnResponse === 'string' ? txnResponse : null);
      
      if (!hash) {
        return { success: false, error: 'Transaction was canceled or rejected in wallet.' };
      }

      // Wait for real on-chain confirmation on Aptos
      const confirmed = await waitForAptosTxn(hash);
      if (confirmed) {
        await refreshBalance();
        return { success: true, txnHash: hash };
      } else {
        return { success: false, error: 'Transaction failed to confirm on Aptos testnet.' };
      }
    } catch (err: any) {
      console.error('payForRead error:', err);
      const isUserCancel = err?.message?.toLowerCase().includes('reject') || 
                           err?.message?.toLowerCase().includes('cancel') ||
                           err?.message?.toLowerCase().includes('declined') ||
                           err?.code === 4001;
      return { 
        success: false, 
        error: isUserCancel ? 'Payment transaction was canceled by user.' : (err?.message || 'Transaction failed') 
      };
    }
  };

  /**
   * Real On-Chain Listing Registration
   */
  const signListingTransaction = async (): Promise<{ success: boolean; txnHash?: string; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Please connect your Petra wallet first.' };
    }

    const wallet = getAptosWallet();
    if (!wallet || !wallet.signAndSubmitTransaction) {
      return { 
        success: false, 
        error: 'Petra wallet extension not available. Please install Petra wallet.' 
      };
    }

    try {
      const payload = buildListingRegistrationPayload(address);
      const txnResponse = await wallet.signAndSubmitTransaction(payload);
      const hash = txnResponse?.hash || (typeof txnResponse === 'string' ? txnResponse : null);
      
      if (!hash) {
        return { success: false, error: 'Listing transaction canceled in wallet.' };
      }

      const confirmed = await waitForAptosTxn(hash);
      if (confirmed) {
        await refreshBalance();
        return { success: true, txnHash: hash };
      }
      return { success: false, error: 'Listing transaction failed to confirm on-chain.' };
    } catch (err: any) {
      const isUserCancel = err?.message?.toLowerCase().includes('reject') || 
                           err?.message?.toLowerCase().includes('cancel') ||
                           err?.message?.toLowerCase().includes('declined') ||
                           err?.code === 4001;
      return { 
        success: false, 
        error: isUserCancel ? 'Listing registration canceled by user.' : (err?.message || 'Listing transaction failed') 
      };
    }
  };

  /**
   * Real On-Chain Delisting Transaction
   */
  const signDelistingTransaction = async (): Promise<{ success: boolean; txnHash?: string; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Please connect your Petra wallet first.' };
    }

    const wallet = getAptosWallet();
    if (!wallet || !wallet.signAndSubmitTransaction) {
      return { 
        success: false, 
        error: 'Petra wallet extension not available. Please install Petra wallet.' 
      };
    }

    try {
      const payload = buildDelistingPayload(address);
      const txnResponse = await wallet.signAndSubmitTransaction(payload);
      const hash = txnResponse?.hash || (typeof txnResponse === 'string' ? txnResponse : null);
      
      if (!hash) {
        return { success: false, error: 'Delisting transaction canceled in wallet.' };
      }

      const confirmed = await waitForAptosTxn(hash);
      if (confirmed) {
        await refreshBalance();
        return { success: true, txnHash: hash };
      }
      return { success: false, error: 'Delisting transaction failed on-chain.' };
    } catch (err: any) {
      const isUserCancel = err?.message?.toLowerCase().includes('reject') || 
                           err?.message?.toLowerCase().includes('cancel') ||
                           err?.message?.toLowerCase().includes('declined') ||
                           err?.code === 4001;
      return { 
        success: false, 
        error: isUserCancel ? 'Delisting signature canceled by user.' : (err?.message || 'Delisting transaction failed') 
      };
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        formattedAddress: address ? formatAddress(address) : '',
        balance,
        walletName,
        connectWallet,
        disconnectWallet,
        payForRead,
        signListingTransaction,
        signDelistingTransaction,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
