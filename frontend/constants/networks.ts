export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerURL: string;
  burntPixWebUrl: string;
  burntPixId: string;
  burntPixArchivesAddress: string;
  baseUrl: string;
}

const NETWORKS = {
  mainnet: {
    chainId: 42,
    name: "LUKSO",
    symbol: "LYX",
    rpcUrl: "https://lukso.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.mainnet.lukso.network",
    baseUrl: "https://burntpix-archives.netlify.app",
    burntPixWebUrl:
      "https://universal.page/collections/0x3983151E0442906000DAb83c8b1cF3f2D2535F82",
    burntPixId: "",
    burntPixArchivesAddress: "",
  },
  testnet: {
    chainId: 4201,
    name: "LUKSO Testnet",
    symbol: "LYXt",
    rpcUrl: "https://lukso-testnet.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.testnet.lukso.network",
    baseUrl: "https://testnet--burntpix-archives.netlify.app",
    burntPixWebUrl:
      "https://universalpage.dev/collections/0x12167f1c2713aC4f740B4700c4C72bC2de6C686f",
    burntPixId: "0x245f9A8Bea516165B45142f8b79eA204f97F8867",
    burntPixArchivesAddress: "0xA084Be8912EeC74660762dbAf15916E1597faAbd",
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
