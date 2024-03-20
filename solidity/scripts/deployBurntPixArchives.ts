const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const contractOwner = UP_ADDR;
  const codehub = "0x9F2B09E9A9628DC8430C7c39BD0Bf74b18b7b397";
  const registry = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
  const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
  const archiveHelpers = "0xAad085A01eF59c0f8b28CeD258680C14167B40d6";
  const constructorArguments = [contractOwner, codehub, registry, burntpicId, archiveHelpers];
  const BurntPixArchivesFactory = new ethers.ContractFactory(
    BurntPixArchives.abi,
    BurntPixArchives.bytecode,
  );
  const onchainHouse = await BurntPixArchivesFactory.connect(signer).deploy(
    ...constructorArguments,{
      gasLimit: 41_000_000n,
    }
  );
  await onchainHouse.waitForDeployment();

  // Verify the contract after deployment
  try {
    await hre.run("verify:verify", {
      address: onchainHouse.target,
      network: "luksoTestnet",
      constructorArguments: [
        ...constructorArguments,
      ],
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ Burnt Pix Archives deployed. Address:', onchainHouse.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });