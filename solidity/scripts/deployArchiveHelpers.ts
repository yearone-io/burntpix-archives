const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import ArchiveHelpers from "../artifacts/contracts/ArchiveHelpers.sol/ArchiveHelpers.json";
import config from '../hardhat.config';
import { getNetworkAccountsConfig } from '../constants/network';

// load env vars
dotenv.config();
const { NETWORK } = process.env;
console.log('NETWORK: ', NETWORK);
const { EOA_PRIVATE_KEY } = getNetworkAccountsConfig(NETWORK as string);

async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider(config.networks[NETWORK].url);
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const ArchiveHelpersFactory = new ethers.ContractFactory(
    ArchiveHelpers.abi,
    ArchiveHelpers.bytecode,
  );
  const onchainArchives = await ArchiveHelpersFactory.connect(signer).deploy(
    {
      gasLimit: 41_000_000n,
    }
  );
  await onchainArchives.waitForDeployment();

  // Verify the contract after deployment
  try {
    await hre.run("verify:verify", {
      address: onchainArchives.target,
      network: NETWORK
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ Burnt Pix Archives Helpers deployed. Address:', onchainArchives.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });