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

export function getNextIterationsGoal(nextLevelIterations: number, currentIterations: number) {
  const multiplier = 1000;
  if (nextLevelIterations <= 1) return multiplier;
  let a = 1;
  let b = 1;
  for (let i = 2; i < nextLevelIterations; i++) {
      const c = a + b;
      a = b;
      b = c;
  }
  return ((a + b) * multiplier) - currentIterations;
}
