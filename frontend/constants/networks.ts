export interface Network {
  domain: string;
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerURL: string;
  originalBurntPicUrl: string;
  burntPixArchivesAddress: string;
  artWebBaseUrl: string;
  profileWebBaseUrl: string;
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
    originalBurntPicUrl:
      "https://universal.page/collections/0x3983151E0442906000DAb83c8b1cF3f2D2535F82",
    artWebBaseUrl: "https://universal.page/collections",
    profileWebBaseUrl: "https://universal.page/profiles",
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
    originalBurntPicUrl:
      "https://universalpage.dev/collections/0x12167f1c2713aC4f740B4700c4C72bC2de6C686f",
    artWebBaseUrl: "https://universalpage.dev/collections",
    profileWebBaseUrl: "https://universalpage.dev/profiles",
    burntPixArchivesAddress: "0x4b8cCCF15514e136beD7d07365D8FA48353e7947",
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
