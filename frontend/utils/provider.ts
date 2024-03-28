import { ethers } from "ethers";
import { getNetworkConfig, Network } from "@/constants/networks";

export const getProvider = (networkConfig: Network) => {
  const providerNetworkParams = {
    name: networkConfig.name,
    chainId: networkConfig.chainId,
  };
  const luksoProvider = getLuksoProvider();
  if (typeof luksoProvider === "string") {
    return new ethers.JsonRpcProvider(
      luksoProvider,
      providerNetworkParams,
    );
  }
  return new ethers.BrowserProvider(
    luksoProvider,
    providerNetworkParams,
  );
};

export const getLuksoProvider = () => {
  const networkConfig = getNetworkConfig(
    process.env.NEXT_PUBLIC_DEFAULT_NETWORK!,
  );
  const rpcUrl = networkConfig.rpcUrl;
  if (window.lukso && Number(window.lukso.chainId) !== networkConfig.chainId) {
    //if extension is connected to a different network than the app then default to app's rpc url
    //we could instead prompt user to change networks but this is mostly used for viewing data and not interactions
    return rpcUrl;
  }
  if (window.lukso) {
    return window.lukso;
  }
  return rpcUrl;
};
