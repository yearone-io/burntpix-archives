const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import ArchiveHelpers from "../artifacts/contracts/ArchiveHelpers.sol/ArchiveHelpers.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY } = process.env;


async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const ArchiveHelpersFactory = new ethers.ContractFactory(
    ArchiveHelpers.abi,
    ArchiveHelpers.bytecode,
  );
  const onchainHouse = await ArchiveHelpersFactory.connect(signer).deploy(
    {
      gasLimit: 41_000_000n,
    }
  );
  await onchainHouse.waitForDeployment();

  // Verify the contract after deployment
  try {
    await hre.run("verify:verify", {
      address: onchainHouse.target,
      network: "luksoTestnet",
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ Burnt Pix Archives Helpers deployed. Address:', onchainHouse.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });