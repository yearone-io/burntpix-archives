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
  // @ts-ignore: not picking up this definition although it exists
  ).refineToArchive(iters);
};
