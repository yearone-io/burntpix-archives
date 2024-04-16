import React from "react";
import { getNetworkConfig, Network } from "@/constants/networks";
import { ethers, JsonRpcSigner } from "ethers";
import { JsonRpcProvider, BrowserProvider } from "ethers";

interface WalletContextType {
  networkConfig: Network;
  provider: JsonRpcProvider | BrowserProvider;
  signer: JsonRpcSigner | undefined;
  account: string | null;
  mainUPController: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoadingAccount: boolean;
  connectedChainId: number | undefined;
  userActionCounter: number;
  setUserActionCounter: React.Dispatch<React.SetStateAction<number>>;
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

const defaultImplementation: WalletContextType = {
  networkConfig: networkConfig,
  provider: DEFAULT_PROVIDER,
  signer: undefined,
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
  userActionCounter: 0,
  setUserActionCounter: () => {
    // Default setUserActionCounter implementation
  },
};

export const WalletContext = React.createContext<WalletContextType>(
  defaultImplementation,
);
