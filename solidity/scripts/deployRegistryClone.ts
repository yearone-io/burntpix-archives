const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import RegistryClone from "../artifacts/contracts/RegistryClone.sol/RegistryClone.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const registry = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
  const codehub = "0x9F2B09E9A9628DC8430C7c39BD0Bf74b18b7b397";
  const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
  const maxArchiveSupply = 100;
  const collectionName = "RegistryClone";
  const symbol = "HOP";
  const contractOwner = UP_ADDR;
  const constructorArguments = [contractOwner, codehub, registry, burntpicId];
  const RegistryCloneFactory = new ethers.ContractFactory(
    RegistryClone.abi,
    RegistryClone.bytecode,
  );
  const onchainHouse = await RegistryCloneFactory.connect(signer).deploy(
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
  console.log('✅ Fractal deployed. Address:', onchainHouse.target);
  // call all of the following write methods on the contract wait for the transaction to be mined, and then output the transaction hash.
  // these are the methods you need to call: getAndSetImage(), getAndSetImageUsingGetData(), getAndSetImageUsingGetDataForTokenId(), getAndSetMetadata(), getAndSetMetadataUsingGetDataForTokenId()
  
  /*
  const methodNames = [
    "refine",
    "refine",
    "refine",
  ];
  for (const methodName of methodNames) {
    try {
      console.log(`calling ${methodName}`);
      const tx = await onchainHouse[methodName](2000, {
        gasLimit: 10000000n,
        gasPrice: 1600000000n
      });
      console.log(`${methodName} tx hash:`, tx.hash);
      const response = await tx.wait();
      console.log(`${methodName} tx mined in block:`, response);
    } catch (error) {
      console.log(`Error calling ${methodName}:`, error);
    }
  }

  const readMethodNames = [
    "getImage",
  ];
  for (const methodName of readMethodNames) {
    try {
      console.log(`calling ${methodName}`);
      const response = await onchainHouse[methodName]();
      console.log(`${methodName} got a success response length:, ${response.length}`);
    } catch (error) {
      const message = error.error?.message || error.message;
      console.error(`Error calling ${methodName}:`, message);
    }
  }
  */

  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });