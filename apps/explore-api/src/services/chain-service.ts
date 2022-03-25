import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import getProviderInstance from '../clients/etherjs';
import { ContractDto } from '@crustnft-explore/data-access';

export async function checkTransaction(contract: ContractDto) {
  const { chainId, txHash, creator, contractAddress } = contract;
  const provider = getProviderInstance(chainId);
  const receipt = await provider.getTransactionReceipt(txHash);
  validateReceipt(txHash, receipt, creator, contractAddress);
}

export function verifySignature(
  account: string,
  signature: string,
  signingMessage: string
) {
  const decodedAddress = ethers.utils.verifyMessage(signingMessage, signature);
  return account.toLowerCase() === decodedAddress.toLowerCase();
}

function validateReceipt(
  txHash: string,
  receipt: TransactionReceipt,
  account: string,
  contract: string
) {
  if (!receipt) {
    throw new Error(`Can not get receipt for txHash: ${txHash}`);
  }

  const isValid =
    receipt?.from.toLowerCase() === account.toLowerCase() &&
    contract.toLowerCase() === receipt.contractAddress.toLowerCase() &&
    receipt.status === 1;

  if (!isValid) {
    throw new Error(`TxHash does not meet requirements`);
  }
}

export function getSigningMessage(nonce: string, account: string) {
  return `Welcome to CrustNft!

Click to sign in and accept the CrustNft Terms of Service: https://crustnft.io/tos

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.

Wallet address:
${account}

Nonce:
${nonce}`;
}
