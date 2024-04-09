import React from "react";
import { getNetworkConfig, Network } from "@/constants/networks";
import { ethers } from "ethers";
import { JsonRpcProvider, BrowserProvider } from "ethers";
import { MulticallProvider } from "@ethers-ext/provider-multicall";

interface WalletContextType {
  networkConfig: Network;
  provider: JsonRpcProvider | BrowserProvider;
  account: string | null;
  mainUPController: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoadingAccount: boolean;
  connectedChainId: number | undefined;
  refineEventCounter: number;
  multicaller: MulticallProvider;
}

const networkConfig = getNetworkConfig(
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK!,
);

export const DEFAULT_PROVIDER = new ethers.JsonRpcProvider(
  networkConfig.rpcUrl,
  {
    name: networkConfig.name,
    chainId: networkConfig.chainId,
  },
);

const multicaller = new MulticallProvider(DEFAULT_PROVIDER);


const defaultImplementation: WalletContextType = {
  networkConfig: networkConfig,
  provider: DEFAULT_PROVIDER,
  multicaller: multicaller,
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
  refineEventCounter: 0,
};

export const WalletContext = React.createContext<WalletContextType>(
  defaultImplementation,
);
