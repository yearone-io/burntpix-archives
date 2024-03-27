import { ethers } from "ethers";
import HouseOfBurntPix from "@/abis/HouseOfBurntPix.json";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export const refineToMint = async (
  iters: number,
  houseOfBurtnPixAddress: string,
  provider: JsonRpcProvider | Web3Provider,
) => {
  const signer = provider.getSigner();
  const houseOfBurntPixContract = new ethers.Contract(
    houseOfBurtnPixAddress,
    HouseOfBurntPix.abi,
    provider,
  );
  return await houseOfBurntPixContract.connect(signer).refineToMint(iters);
};
