import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import getProviderInstance from '../clients/etherjs';
import { Contract } from '../endpoints/contracts/types';

export async function checkTransaction(contract: Contract) {
  const { chainId, txHash, account, contractAddress } = contract;
  const provider = getProviderInstance(chainId);
  const receipt = await provider.getTransactionReceipt(txHash);
  validateReceipt(txHash, receipt, account, contractAddress);
}

export function verifySignature(
  account: string,
  signature: string,
  userNonce: string
) {
  const decodedAddress = ethers.utils.verifyMessage(userNonce, signature);
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
