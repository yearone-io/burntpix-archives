export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerURL: string;
}

const NETWORKS = {
  mainnet: {
    chainId: 42,
    name: "LUKSO",
    symbol: "LYX",
    rpcUrl: "https://lukso.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.mainnet.lukso.network",
    baseUrl: " ", // TODO add mainnet base url
  },
  testnet: {
    chainId: 4201,
    name: "LUKSO Testnet",
    symbol: "LYXt",
    rpcUrl: "https://lukso-testnet.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.testnet.lukso.network",
    baseUrl: " ", // TODO add testnet base url
  },
} as {
  [key: string]: Network;
};

export const getNetworkConfig = (name: string) => {
  switch (name) {
    case "mainnet":
      return NETWORKS.mainnet;
    case "testnet":
      return NETWORKS.testnet;
    default:
      throw new Error(`Unknown network ${name}`);
  }
};
