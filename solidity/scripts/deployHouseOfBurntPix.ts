const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import HouseOfBurntPix from "../artifacts/contracts/HouseOfBurntPix.sol/HouseOfBurntPix.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const collectionName = "HouseOfBurntPix";
  const symbol = "HOP";
  const contractOwner = UP_ADDR;
  const maxArchiveNFTs = 100;
  const burntpixCollection = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
  const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
  const constructorArguments = [collectionName, symbol, contractOwner, maxArchiveNFTs, burntpixCollection, burntpicId];
  const HouseOfBurntPixFactory = new ethers.ContractFactory(
    HouseOfBurntPix.abi,
    HouseOfBurntPix.bytecode,
  );
  const houseDeployTx = await HouseOfBurntPixFactory.connect(signer).deploy(
    ...constructorArguments,
  );
  await houseDeployTx.waitForDeployment();

  // Verify the contract after deployment
  try {
    await hre.run("verify:verify", {
      address: houseDeployTx.target,
      network: "luksoTestnet",
      constructorArguments: [
        ...constructorArguments,
      ],
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ House deployed. Address:', houseDeployTx.target);
  // call all of the following write methods on the contract wait for the transaction to be mined, and then output the transaction hash.
  // these are the methods you need to call: getAndSetImage(), getAndSetImageUsingGetData(), getAndSetImageUsingGetDataForTokenId(), getAndSetMetadata(), getAndSetMetadataUsingGetDataForTokenId()
  const methodNames = [
    "getAndSetImage",
    "getAndSetImageUsingGetData",
    "getAndSetImageUsingGetDataForTokenId",
    "getAndSetMetadata",
    "getAndSetMetadataUsingGetDataForTokenId",
  ];
  for (const methodName of methodNames) {
    try {
      console.log(`calling ${methodName}`);
      const tx = await houseDeployTx[methodName]({gasLimit: 40_000_000});
      console.log(`${methodName} tx hash:`, tx.hash);
      await tx.wait();
    } catch (error) {
      // break down ethers error message
      const errorMessage = error?.error?.message || error?.message;
      console.error(`Error calling ${methodName}:`, errorMessage);
    }
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });