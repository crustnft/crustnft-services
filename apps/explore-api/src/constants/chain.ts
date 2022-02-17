const PROD_CHAINS = [
  {
    name: 'Ethereum',
    currencySymbol: 'ETH',
    icon: './static/icons/networks/ethereum.svg',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/741c5f1257a24106934fe4105c784478',
    blockExplorerUrl: 'https://etherscan.io',
  },
  {
    name: 'Binance',
    currencySymbol: 'BNB',
    icon: './static/icons/networks/binance.svg',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com',
  },
  {
    name: 'Polygon',
    currencySymbol: 'MATIC',
    icon: './static/icons/networks/polygon.svg',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrl: 'https://polygonscan.com',
  },
  {
    name: 'Avalanche',
    currencySymbol: 'AVAX',
    icon: './static/icons/networks/avalanche.svg',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorerUrl: 'https://snowtrace.io',
  },
];

const TEST_CHAINS = [
  {
    name: 'Rinkeby',
    currencySymbol: 'RIN',
    icon: './static/icons/networks/ethereum.svg',
    chainId: 4,
    rpcUrl: 'https://rinkeby.infura.io/v3/741c5f1257a24106934fe4105c784478',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
  },
];

const noneProduction = process.env.APP_ENV !== 'prod';

export const SUPPORTED_CHAINS = noneProduction
  ? [...TEST_CHAINS, ...PROD_CHAINS]
  : PROD_CHAINS;
