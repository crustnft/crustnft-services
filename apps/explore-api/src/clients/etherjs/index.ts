import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../../constants/chain';

let providerInstance: JsonRpcProvider;
function getProviderInstance(chainId: number) {
  if (!providerInstance) {
    const chain = getChain(chainId);
    const provider = new ethers.providers.JsonRpcProvider({
      url: chain.rpcUrl,
    });
    providerInstance = provider;
  }
  return providerInstance;
}

function getChain(chainId: number) {
  const foundChain = SUPPORTED_CHAINS.find(
    (chain) => chain.chainId === chainId
  );
  if (foundChain) {
    return foundChain;
  }
  throw new Error(`Given chainId is not supported`);
}

export default getProviderInstance;
