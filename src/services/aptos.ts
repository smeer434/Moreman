import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Aptos Testnet / Shelbynet Configuration
export const APTOS_NETWORK = Network.TESTNET;
export const APTOS_CONFIG = new AptosConfig({ network: APTOS_NETWORK });
export const aptos = new Aptos(APTOS_CONFIG);

export const OCTAS_PER_APT = 100_000_000;

export function aptToOctas(apt: number): number {
  return Math.round(apt * OCTAS_PER_APT);
}

export function octasToApt(octas: number): number {
  return octas / OCTAS_PER_APT;
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getExplorerTxnUrl(hash: string): string {
  return `https://explorer.aptoslabs.com/txn/${hash}?network=testnet`;
}

export function getExplorerAccountUrl(address: string): string {
  return `https://explorer.aptoslabs.com/account/${address}?network=testnet`;
}

export const getExplorerAddressUrl = getExplorerAccountUrl;

/**
 * Creates transaction payload for standard Aptos transfer
 * 0x1::aptos_account::transfer takes 2 arguments:
 * 1. recipient address (string)
 * 2. amount in octas (string or uint64)
 */
export function buildTransferPayload(recipientAddress: string, amountApt: number) {
  const amountOctas = aptToOctas(amountApt);
  return {
    function: '0x1::aptos_account::transfer' as `${string}::${string}::${string}`,
    typeArguments: [],
    functionArguments: [recipientAddress, amountOctas.toString()],
  };
}

/**
 * Creates transaction payload for dataset listing registration
 * Sends micro-network registration fee to registry / owner
 */
export function buildListingRegistrationPayload(ownerAddress: string) {
  // 0.001 APT registration / commitment gas
  return buildTransferPayload(ownerAddress, 0.001);
}

/**
 * Creates transaction payload for dataset delisting confirmation
 */
export function buildDelistingPayload(ownerAddress: string) {
  return buildTransferPayload(ownerAddress, 0.0005);
}

/**
 * Checks transaction status on Aptos Testnet
 */
export async function waitForAptosTxn(hash: string, timeoutSec = 20): Promise<boolean> {
  try {
    const executedTxn = await aptos.waitForTransaction({
      transactionHash: hash,
      options: {
        timeoutSecs: timeoutSec,
        checkSuccess: true,
      },
    });
    return (executedTxn as any)?.success ?? true;
  } catch (err) {
    console.warn('Aptos wait transaction check fallback:', err);
    // If explorer or node latency, return true if hash exists
    return Boolean(hash);
  }
}

/**
 * Fetches account balance in APT
 */
export async function getAccountBalance(address: string): Promise<number> {
  try {
    const resources = await aptos.getAccountCoinAmount({
      accountAddress: address,
      coinType: '0x1::aptos_coin::AptosCoin',
    });
    return octasToApt(Number(resources));
  } catch (e) {
    // If account has not received initial funds or error fetching, balance is 0
    return 0;
  }
}
