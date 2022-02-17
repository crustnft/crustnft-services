import { TransactionReceipt } from '@ethersproject/abstract-provider';
import getProviderInstance from '../clients/etherjs';
import { Contract } from '../endpoints/contracts/types';

export async function checkTransaction(contract: Contract) {
  const { chainId, txHash, account, contractAddress } = contract;
  const provider = getProviderInstance(chainId);
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!isValid(receipt, account, contractAddress)) {
    throw new Error(`TxHash does not meet requirements`);
  }
}

function isValid(
  receipt: TransactionReceipt,
  account: string,
  contract: string
) {
  return (
    receipt?.from.toLowerCase() === account.toLowerCase() &&
    contract.toLowerCase() === receipt.contractAddress.toLowerCase() &&
    receipt.status === 1
  );
}
