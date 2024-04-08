export interface Network {
  domain: string;
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerURL: string;
  marketplaceCollectionsURL: string;
  burntPixCollectionAddress: string;
  burntPixArchivesAddress: string;
  marketplaceProfilesURL: string;
  baseUrl: string;
}

const NETWORKS = {
  mainnet: {
    domain: "https://burntpix-archives.netlify.app",
    chainId: 42,
    name: "LUKSO",
    symbol: "LYX",
    rpcUrl: "https://lukso.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.mainnet.lukso.network",
    baseUrl: "https://burntpix-archives.netlify.app",
    marketplaceCollectionsURL: "https://universal.page/collections",
    burntPixCollectionAddress: "0x3983151E0442906000DAb83c8b1cF3f2D2535F82",
    marketplaceProfilesURL: "https://universal.page/profiles",
    burntPixArchivesAddress: "0x4b8cCCF15514e136beD7d07365D8FA48353e7947", //TODO update this
  },
  testnet: {
    domain: "https://testnet--burntpix-archives.netlify.app",
    chainId: 4201,
    name: "LUKSO Testnet",
    symbol: "LYXt",
    rpcUrl: "https://lukso-testnet.rpc.thirdweb.com",
    explorerURL: "https://explorer.execution.testnet.lukso.network",
    baseUrl: "https://testnet--burntpix-archives.netlify.app",
    marketplaceCollectionsURL: "https://universalpage.dev/collections",
    burntPixCollectionAddress: "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f",
    marketplaceProfilesURL: "https://universalpage.dev/profiles",
    burntPixArchivesAddress: "0x7a861014FA2302d8C33662Df45a5030b59c02015",
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
