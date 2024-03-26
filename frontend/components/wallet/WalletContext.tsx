import React from "react";
import { getNetworkConfig, Network } from "@/constants/networks";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

interface WalletContextType {
  networkConfig: Network;
  provider: JsonRpcProvider | Web3Provider;
  account: string | null;
  mainUPController: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoadingAccount: boolean;
  connectedChainId: number | undefined;
}

const networkConfig = getNetworkConfig(
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK!,
);

export const DEFAULT_PROVIDER = new ethers.providers.JsonRpcProvider(
  networkConfig.rpcUrl,
  {
    name: networkConfig.name,
    chainId: networkConfig.chainId,
  },
);

const defaultImplementation: WalletContextType = {
  networkConfig: networkConfig,
  provider: DEFAULT_PROVIDER,
  account: null,
  mainUPController: undefined,
  isLoadingAccount: true,
  connect: async () => {
    // Default connect implementation
  },
  disconnect: () => {
    // Default disconnect implementation
  },
  connectedChainId: undefined,
};

export const WalletContext = React.createContext<WalletContextType>(
  defaultImplementation,
);
