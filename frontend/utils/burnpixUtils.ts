import { JsonRpcProvider, BrowserProvider } from "ethers";
import { HouseOfBurntPix__factory } from "@/contracts";

export const refineToMint = async (
  iters: number,
  houseOfBurtnPixAddress: string,
  provider: JsonRpcProvider | BrowserProvider,
) => {
  const signer = await provider.getSigner();
  return HouseOfBurntPix__factory.connect(houseOfBurtnPixAddress, signer).refineToMint(iters, signer.address);
};
