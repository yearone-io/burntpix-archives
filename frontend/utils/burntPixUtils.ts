import { JsonRpcProvider, BrowserProvider } from "ethers";
import { BurntPixArchives__factory } from "@/contracts";

export const refineToArchive = async (
  iters: number,
  burntPixArchivesAddress: string,
  provider: JsonRpcProvider | BrowserProvider,
) => {
  const signer = await provider.getSigner();
  return BurntPixArchives__factory.connect(
    burntPixArchivesAddress,
    signer,
  ).refineToArchive(iters);
};
