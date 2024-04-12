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
    burntPixArchivesAddress: "0xe25Dd0db1964Ae3D36a0C2725AFa8454680cD0d4", //TODO update this
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
    burntPixArchivesAddress: "0x9307EEBBaF3748410501eD11d6EAa40B97100045",
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
