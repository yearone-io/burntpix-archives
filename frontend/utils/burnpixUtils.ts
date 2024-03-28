import { JsonRpcProvider, BrowserProvider } from "ethers";
import { BurntPixArchives__factory } from "@/contracts";

export const refineToMint = async (
  iters: number,
  houseOfBurtnPixAddress: string,
  provider: JsonRpcProvider | BrowserProvider,
) => {
  const signer = await provider.getSigner();
  return BurntPixArchives__factory.connect(
    houseOfBurtnPixAddress,
    signer,
  ).refineToMint(iters);
};
